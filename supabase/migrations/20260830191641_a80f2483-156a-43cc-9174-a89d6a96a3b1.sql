-- ============ enums ============
create type public.app_role as enum ('admin','moderator','user');
create type public.agent_status as enum ('active','idle','error','offline');
create type public.task_priority as enum ('low','medium','high','urgent');
create type public.board_column as enum ('todo','doing','input','done');
create type public.log_category as enum ('observation','general','reminder','fyi');
create type public.council_status as enum ('concluded','in progress');
create type public.meeting_sentiment as enum ('positive','neutral','mixed');

-- ============ core identity ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile write" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own profile insert" on public.profiles for insert to authenticated with check (id = auth.uid());

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.organizations to authenticated;
grant all on public.organizations to service_role;
alter table public.organizations enable row level security;

create table public.org_members (
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
grant select, insert, delete on public.org_members to authenticated;
grant all on public.org_members to service_role;
alter table public.org_members enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_org_member(_org_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.org_members where org_id = _org_id and user_id = auth.uid())
$$;

create policy "members read org" on public.organizations for select to authenticated using (public.is_org_member(id));
create policy "own memberships" on public.org_members for select to authenticated using (user_id = auth.uid() or public.is_org_member(org_id));
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- ============ agents ============
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  external_id text,
  name text not null,
  emoji text not null default '🤖',
  subtitle text not null default '',
  type text not null default 'Agent',
  role text not null default '',
  status public.agent_status not null default 'offline',
  current_activity text not null default '',
  last_seen_at timestamptz not null default now(),
  tasks_completed integer not null default 0,
  accuracy numeric(5,2) not null default 0,
  skills text[] not null default '{}',
  accent text not null default 'primary',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (org_id, external_id)
);
grant select, insert, update, delete on public.agents to authenticated;
grant all on public.agents to service_role;
alter table public.agents enable row level security;
create policy "members manage agents" on public.agents for all to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

create table public.agent_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  action text not null,
  created_at timestamptz not null default now()
);
create index agent_events_org_created_idx on public.agent_events (org_id, created_at desc);
grant select, insert on public.agent_events to authenticated;
grant all on public.agent_events to service_role;
alter table public.agent_events enable row level security;
create policy "members read events" on public.agent_events for select to authenticated using (public.is_org_member(org_id));
create policy "members insert events" on public.agent_events for insert to authenticated with check (public.is_org_member(org_id));

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  title text not null,
  board_column public.board_column not null default 'todo',
  progress integer,
  priority public.task_priority not null default 'medium',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_org_idx on public.tasks (org_id, board_column);
grant select, insert, update, delete on public.tasks to authenticated;
grant all on public.tasks to service_role;
alter table public.tasks enable row level security;
create policy "members manage tasks" on public.tasks for all to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

create table public.agent_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete cascade,
  category public.log_category not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);
create index agent_logs_org_created_idx on public.agent_logs (org_id, created_at desc);
grant select, insert on public.agent_logs to authenticated;
grant all on public.agent_logs to service_role;
alter table public.agent_logs enable row level security;
create policy "members read logs" on public.agent_logs for select to authenticated using (public.is_org_member(org_id));
create policy "members insert logs" on public.agent_logs for insert to authenticated with check (public.is_org_member(org_id));

-- ============ council ============
create table public.council_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  question text not null,
  status public.council_status not null default 'in progress',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.council_sessions to authenticated;
grant all on public.council_sessions to service_role;
alter table public.council_sessions enable row level security;
create policy "members manage sessions" on public.council_sessions for all to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

create table public.council_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.council_sessions(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  sent integer not null default 0,
  msg_limit integer not null default 2,
  done boolean not null default false,
  unique (session_id, agent_id)
);
grant select, insert, update, delete on public.council_participants to authenticated;
grant all on public.council_participants to service_role;
alter table public.council_participants enable row level security;
create policy "members manage participants" on public.council_participants for all to authenticated
  using (exists (select 1 from public.council_sessions s where s.id = session_id and public.is_org_member(s.org_id)))
  with check (exists (select 1 from public.council_sessions s where s.id = session_id and public.is_org_member(s.org_id)));

create table public.council_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.council_sessions(id) on delete cascade,
  agent_id uuid not null references public.agents(id) on delete cascade,
  idx integer not null default 1,
  text text not null,
  created_at timestamptz not null default now()
);
create index council_messages_session_idx on public.council_messages (session_id, idx);
grant select, insert on public.council_messages to authenticated;
grant all on public.council_messages to service_role;
alter table public.council_messages enable row level security;
create policy "members read messages" on public.council_messages for select to authenticated
  using (exists (select 1 from public.council_sessions s where s.id = session_id and public.is_org_member(s.org_id)));
create policy "members insert messages" on public.council_messages for insert to authenticated
  with check (exists (select 1 from public.council_sessions s where s.id = session_id and public.is_org_member(s.org_id)));

-- ============ meetings ============
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  meeting_date timestamptz not null default now(),
  duration_minutes integer not null default 30,
  attendees text[] not null default '{}',
  summary text not null default '',
  ai_insights text not null default '',
  meeting_type text not null default 'team',
  sentiment public.meeting_sentiment not null default 'neutral',
  has_external_participants boolean not null default false,
  external_domains text[] not null default '{}',
  fathom_url text,
  share_url text,
  created_at timestamptz not null default now()
);
create index meetings_org_date_idx on public.meetings (org_id, meeting_date desc);
grant select, insert, update, delete on public.meetings to authenticated;
grant all on public.meetings to service_role;
alter table public.meetings enable row level security;
create policy "members manage meetings" on public.meetings for all to authenticated using (public.is_org_member(org_id)) with check (public.is_org_member(org_id));

create table public.meeting_action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  task text not null,
  assignee text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.meeting_action_items to authenticated;
grant all on public.meeting_action_items to service_role;
alter table public.meeting_action_items enable row level security;
create policy "members manage action items" on public.meeting_action_items for all to authenticated
  using (exists (select 1 from public.meetings m where m.id = meeting_id and public.is_org_member(m.org_id)))
  with check (exists (select 1 from public.meetings m where m.id = meeting_id and public.is_org_member(m.org_id)));

-- ============ outbound command audit ============
create table public.agent_commands (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  agent_id uuid references public.agents(id) on delete set null,
  requested_by uuid references auth.users(id) on delete set null,
  kind text not null,
  payload jsonb not null default '{}',
  status text not null default 'pending',
  response jsonb,
  created_at timestamptz not null default now()
);
create index agent_commands_org_created_idx on public.agent_commands (org_id, created_at desc);
grant select on public.agent_commands to authenticated;
grant all on public.agent_commands to service_role;
alter table public.agent_commands enable row level security;
create policy "members read commands" on public.agent_commands for select to authenticated using (public.is_org_member(org_id));

-- ============ updated_at ============
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;
create trigger agents_touch before update on public.agents for each row execute function public.touch_updated_at();
create trigger tasks_touch before update on public.tasks for each row execute function public.touch_updated_at();

-- ============ signup bootstrap + starter data ============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_org uuid;
  a_alpha uuid; a_dispatch uuid; a_audit uuid;
  s1 uuid; s2 uuid;
  m1 uuid; m2 uuid; m3 uuid;
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)));

  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;

  insert into public.organizations (name, created_by)
  values (coalesce(split_part(new.email,'@',1),'My') || '''s workspace', new.id)
  returning id into v_org;

  insert into public.org_members (org_id, user_id, role) values (v_org, new.id, 'owner');

  insert into public.agents (org_id, external_id, name, emoji, subtitle, type, role, status, current_activity, last_seen_at, tasks_completed, accuracy, skills, accent)
  values (v_org,'alpha','Agent Alpha','🤖','Autonomous build & refactor specialist','Code Agent','Lead Engineer','active','Refactoring billing module', now(), 1284, 98.4, array['TypeScript','Code review','Test generation','Refactoring','CI triage'],'primary')
  returning id into a_alpha;
  insert into public.agents (org_id, external_id, name, emoji, subtitle, type, role, status, current_activity, last_seen_at, tasks_completed, accuracy, skills, accent)
  values (v_org,'dispatch','Dispatch Bot','📋','Routes work across the agent fleet','Coordinator','Operations Director','idle','Awaiting new task intake', now() - interval '4 minutes', 842, 95.1, array['Task routing','Scheduling','Escalation','Capacity planning'],'amber')
  returning id into a_dispatch;
  insert into public.agents (org_id, external_id, name, emoji, subtitle, type, role, status, current_activity, last_seen_at, tasks_completed, accuracy, skills, accent)
  values (v_org,'audit','Audit Bot','🛡️','Verifies output quality and compliance','Quality Agent','Compliance Officer','active','Scanning 12 pull requests', now(), 611, 99.2, array['Policy checks','Security review','Data hygiene','Reporting'],'cyan')
  returning id into a_audit;

  insert into public.agent_events (org_id, agent_id, action, created_at) values
    (v_org, a_alpha, 'Merged PR #481 — checkout retry logic', now() - interval '2 minutes'),
    (v_org, a_audit, 'Flagged 1 policy violation in export job', now() - interval '7 minutes'),
    (v_org, a_dispatch, 'Assigned 3 tasks to Agent Alpha', now() - interval '14 minutes'),
    (v_org, a_alpha, 'Generated 42 unit tests for pricing service', now() - interval '28 minutes'),
    (v_org, a_audit, 'Approved release candidate 2.14.0', now() - interval '46 minutes'),
    (v_org, a_dispatch, 'Escalated stalled task to human review', now() - interval '71 minutes'),
    (v_org, a_alpha, 'Resolved failing CI pipeline on main', now() - interval '96 minutes'),
    (v_org, a_audit, 'Completed weekly compliance sweep', now() - interval '140 minutes'),
    (v_org, a_dispatch, 'Rebalanced queue after capacity spike', now() - interval '188 minutes');

  insert into public.tasks (org_id, agent_id, title, board_column, progress, priority) values
    (v_org, a_alpha,'Migrate auth service to v3 SDK','todo',null,'high'),
    (v_org, a_dispatch,'Draft Q3 agent capacity forecast','todo',null,'medium'),
    (v_org, a_alpha,'Add rate limiting to public API','todo',null,'urgent'),
    (v_org, a_alpha,'Refactor billing module','doing',68,'high'),
    (v_org, a_audit,'Scan open pull requests','doing',41,'medium'),
    (v_org, a_dispatch,'Rebalance task queue','doing',87,'low'),
    (v_org, a_audit,'Confirm data retention policy','input',null,'urgent'),
    (v_org, a_dispatch,'Approve vendor access request','input',null,'medium'),
    (v_org, a_alpha,'Ship release 2.14.0','done',null,'high'),
    (v_org, a_audit,'Weekly compliance sweep','done',null,'low');

  insert into public.agent_logs (org_id, agent_id, category, message, created_at) values
    (v_org, a_alpha,'observation','Checkout latency dropped 22% after retry refactor.', now() - interval '3 minutes'),
    (v_org, a_audit,'reminder','SOC2 evidence bundle due in 4 days.', now() - interval '11 minutes'),
    (v_org, a_dispatch,'general','Queue depth normalized to 14 open tasks.', now() - interval '22 minutes'),
    (v_org, a_audit,'fyi','New policy pack v9 loaded into rule engine.', now() - interval '38 minutes'),
    (v_org, a_alpha,'observation','Test coverage on pricing service now 91%.', now() - interval '55 minutes'),
    (v_org, a_dispatch,'reminder','Human review needed on stalled task T-118.', now() - interval '88 minutes'),
    (v_org, a_alpha,'general','Nightly build finished in 6m 12s.', now() - interval '132 minutes'),
    (v_org, a_audit,'observation','Two exports contained unmasked emails; blocked.', now() - interval '174 minutes'),
    (v_org, a_dispatch,'fyi','Capacity headroom at 38% for next sprint.', now() - interval '240 minutes');

  insert into public.council_sessions (org_id, question, status) values
    (v_org,'Should we ship the new pricing engine before the audit completes?','concluded') returning id into s1;
  insert into public.council_participants (session_id, agent_id, sent, msg_limit, done) values
    (s1, a_alpha, 2, 2, true), (s1, a_audit, 2, 2, true), (s1, a_dispatch, 1, 2, true);
  insert into public.council_messages (session_id, agent_id, idx, text, created_at) values
    (s1, a_alpha, 1, 'Engine is feature complete and covered at 91%. Shipping behind a flag lets us collect real traffic data this week.', now() - interval '120 minutes'),
    (s1, a_audit, 2, 'Two data-handling checks are still open. A flagged rollout is acceptable only if EU traffic stays excluded.', now() - interval '112 minutes'),
    (s1, a_dispatch, 3, 'I can gate EU accounts at the router and keep rollout at 10% until audit clears.', now() - interval '104 minutes'),
    (s1, a_alpha, 4, 'Agreed — flagged 10% rollout, EU excluded, full launch after audit sign-off.', now() - interval '99 minutes'),
    (s1, a_audit, 5, 'Approved under those constraints. I''ll report back within 48 hours.', now() - interval '95 minutes');

  insert into public.council_sessions (org_id, question, status) values
    (v_org,'What is the right escalation threshold for stalled agent tasks?','in progress') returning id into s2;
  insert into public.council_participants (session_id, agent_id, sent, msg_limit, done) values
    (s2, a_dispatch, 2, 3, false), (s2, a_alpha, 1, 3, false), (s2, a_audit, 1, 3, false);
  insert into public.council_messages (session_id, agent_id, idx, text, created_at) values
    (s2, a_dispatch, 1, 'Current threshold of 6 hours produces too many false escalations on long-running builds.', now() - interval '40 minutes'),
    (s2, a_alpha, 2, 'Suggest measuring progress deltas instead of wall clock — escalate when progress stalls 45 minutes.', now() - interval '34 minutes'),
    (s2, a_audit, 3, 'Any threshold must still guarantee a human sees compliance-tagged tasks within 2 hours.', now() - interval '26 minutes'),
    (s2, a_dispatch, 4, 'Then two tiers: progress-based for standard work, hard 2h cap for compliance-tagged.', now() - interval '18 minutes');

  insert into public.meetings (org_id, title, meeting_date, duration_minutes, attendees, summary, ai_insights, meeting_type, sentiment, has_external_participants, external_domains)
  values (v_org,'Weekly Standup with Engineering', now() - interval '2 days', 30, array['Alice','Bob','Charlie'],
    '**Sprint progress reviewed.** Backend API is 80% complete; the pricing service refactor landed behind a flag.

- Frontend blocked on the new schema until Thursday
- QA environment stabilized after CI fix',
    '30 min meeting with 3 attendees — tight agenda, no overruns.','standup','positive',false,'{}') returning id into m1;
  insert into public.meeting_action_items (meeting_id, task, assignee, done) values
    (m1,'Review PR #42','Alice',false), (m1,'Update API docs','Bob',true);

  insert into public.meetings (org_id, title, meeting_date, duration_minutes, attendees, summary, ai_insights, meeting_type, sentiment, has_external_participants, external_domains, fathom_url, share_url)
  values (v_org,'Discovery Call — Northwind Logistics', now() - interval '3 days', 45, array['Priya','Sam','M. Okafor','L. Tran'],
    '**Strong fit for agent automation.** Northwind runs 200+ manual dispatch decisions daily and wants an audit trail.

Budget approved for a Q4 pilot.',
    'High buying intent — pricing raised by the prospect twice.','sales','positive',true,array['northwind-logistics.com'],'https://example.com/recording/m3','https://example.com/share/m3') returning id into m2;
  insert into public.meeting_action_items (meeting_id, task, assignee, done) values
    (m2,'Send pilot scoping doc','Priya',false), (m2,'Prepare security questionnaire','Sam',false);

  insert into public.meetings (org_id, title, meeting_date, duration_minutes, attendees, summary, ai_insights, meeting_type, sentiment, has_external_participants, external_domains, share_url)
  values (v_org,'Q4 Roadmap Planning', now() - interval '40 days', 90, array['Alice','Charlie','Dana','Eli','Priya'],
    '**Three bets chosen:** agent council, meeting intelligence, and compliance automation.',
    'Longest meeting this month — consider splitting into two sessions.','planning','positive',false,'{}','https://example.com/share/m9') returning id into m3;
  insert into public.meeting_action_items (meeting_id, task, assignee, done) values
    (m3,'Write roadmap brief','Charlie',false), (m3,'Size compliance work','Eli',false), (m3,'Confirm hiring plan','Alice',true);

  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ realtime ============
alter publication supabase_realtime add table public.agents;
alter publication supabase_realtime add table public.tasks;
alter publication supabase_realtime add table public.agent_logs;
alter publication supabase_realtime add table public.agent_events;
alter publication supabase_realtime add table public.council_messages;