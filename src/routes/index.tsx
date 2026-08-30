import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/clawbuddy/Header";
import { CommandDeck } from "@/components/clawbuddy/CommandDeck";
import { AgentProfiles } from "@/components/clawbuddy/AgentProfiles";
import { TaskBoard } from "@/components/clawbuddy/TaskBoard";
import { AiLog } from "@/components/clawbuddy/AiLog";
import { Council } from "@/components/clawbuddy/Council";
import { Meetings } from "@/components/clawbuddy/Meetings";

const TITLE = "ClawBuddy — AI Agent Command Center";
const DESCRIPTION =
  "Mission control for your AI workforce: agent status, kanban task board, activity logs, agent councils, and meeting intelligence.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TABS = [
  { id: "deck", label: "Command Deck", render: () => <CommandDeck /> },
  { id: "agents", label: "Agents", render: () => <AgentProfiles /> },
  { id: "tasks", label: "Task Board", render: () => <TaskBoard /> },
  { id: "log", label: "AI Log", render: () => <AiLog /> },
  { id: "council", label: "Council", render: () => <Council /> },
  { id: "meetings", label: "Meetings", render: () => <Meetings /> },
];

function Index() {
  const [tab, setTab] = useState("deck");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      <Header />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="glass-card h-auto w-full flex-wrap justify-start gap-1 p-1.5">
          {TABS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <TabsTrigger
                value={t.id}
                className="rounded-md px-3.5 py-2 text-sm data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
              >
                {t.label}
              </TabsTrigger>
            </motion.div>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.section
          key={tab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="sr-only">{active.label}</h2>
          {active.render()}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
