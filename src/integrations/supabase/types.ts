export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_commands: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          kind: string
          org_id: string
          payload: Json
          requested_by: string | null
          response: Json | null
          status: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          kind: string
          org_id: string
          payload?: Json
          requested_by?: string | null
          response?: Json | null
          status?: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          kind?: string
          org_id?: string
          payload?: Json
          requested_by?: string | null
          response?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_commands_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_commands_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_events: {
        Row: {
          action: string
          agent_id: string | null
          created_at: string
          id: string
          org_id: string
        }
        Insert: {
          action: string
          agent_id?: string | null
          created_at?: string
          id?: string
          org_id: string
        }
        Update: {
          action?: string
          agent_id?: string | null
          created_at?: string
          id?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_events_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_events_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_logs: {
        Row: {
          agent_id: string | null
          category: Database["public"]["Enums"]["log_category"]
          created_at: string
          id: string
          message: string
          org_id: string
        }
        Insert: {
          agent_id?: string | null
          category?: Database["public"]["Enums"]["log_category"]
          created_at?: string
          id?: string
          message: string
          org_id: string
        }
        Update: {
          agent_id?: string | null
          category?: Database["public"]["Enums"]["log_category"]
          created_at?: string
          id?: string
          message?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_logs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_logs_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          accent: string
          accuracy: number
          created_at: string
          current_activity: string
          emoji: string
          external_id: string | null
          id: string
          last_seen_at: string
          name: string
          org_id: string
          role: string
          skills: string[]
          status: Database["public"]["Enums"]["agent_status"]
          subtitle: string
          tasks_completed: number
          type: string
          updated_at: string
        }
        Insert: {
          accent?: string
          accuracy?: number
          created_at?: string
          current_activity?: string
          emoji?: string
          external_id?: string | null
          id?: string
          last_seen_at?: string
          name: string
          org_id: string
          role?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["agent_status"]
          subtitle?: string
          tasks_completed?: number
          type?: string
          updated_at?: string
        }
        Update: {
          accent?: string
          accuracy?: number
          created_at?: string
          current_activity?: string
          emoji?: string
          external_id?: string | null
          id?: string
          last_seen_at?: string
          name?: string
          org_id?: string
          role?: string
          skills?: string[]
          status?: Database["public"]["Enums"]["agent_status"]
          subtitle?: string
          tasks_completed?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agents_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      council_messages: {
        Row: {
          agent_id: string
          created_at: string
          id: string
          idx: number
          session_id: string
          text: string
        }
        Insert: {
          agent_id: string
          created_at?: string
          id?: string
          idx?: number
          session_id: string
          text: string
        }
        Update: {
          agent_id?: string
          created_at?: string
          id?: string
          idx?: number
          session_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "council_messages_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "council_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "council_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      council_participants: {
        Row: {
          agent_id: string
          done: boolean
          id: string
          msg_limit: number
          sent: number
          session_id: string
        }
        Insert: {
          agent_id: string
          done?: boolean
          id?: string
          msg_limit?: number
          sent?: number
          session_id: string
        }
        Update: {
          agent_id?: string
          done?: boolean
          id?: string
          msg_limit?: number
          sent?: number
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "council_participants_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "council_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "council_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      council_sessions: {
        Row: {
          created_at: string
          id: string
          org_id: string
          question: string
          status: Database["public"]["Enums"]["council_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          org_id: string
          question: string
          status?: Database["public"]["Enums"]["council_status"]
        }
        Update: {
          created_at?: string
          id?: string
          org_id?: string
          question?: string
          status?: Database["public"]["Enums"]["council_status"]
        }
        Relationships: [
          {
            foreignKeyName: "council_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_action_items: {
        Row: {
          assignee: string
          created_at: string
          done: boolean
          id: string
          meeting_id: string
          task: string
        }
        Insert: {
          assignee?: string
          created_at?: string
          done?: boolean
          id?: string
          meeting_id: string
          task: string
        }
        Update: {
          assignee?: string
          created_at?: string
          done?: boolean
          id?: string
          meeting_id?: string
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          ai_insights: string
          attendees: string[]
          created_at: string
          duration_minutes: number
          external_domains: string[]
          fathom_url: string | null
          has_external_participants: boolean
          id: string
          meeting_date: string
          meeting_type: string
          org_id: string
          sentiment: Database["public"]["Enums"]["meeting_sentiment"]
          share_url: string | null
          summary: string
          title: string
        }
        Insert: {
          ai_insights?: string
          attendees?: string[]
          created_at?: string
          duration_minutes?: number
          external_domains?: string[]
          fathom_url?: string | null
          has_external_participants?: boolean
          id?: string
          meeting_date?: string
          meeting_type?: string
          org_id: string
          sentiment?: Database["public"]["Enums"]["meeting_sentiment"]
          share_url?: string | null
          summary?: string
          title: string
        }
        Update: {
          ai_insights?: string
          attendees?: string[]
          created_at?: string
          duration_minutes?: number
          external_domains?: string[]
          fathom_url?: string | null
          has_external_participants?: boolean
          id?: string
          meeting_date?: string
          meeting_type?: string
          org_id?: string
          sentiment?: Database["public"]["Enums"]["meeting_sentiment"]
          share_url?: string | null
          summary?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          created_at: string
          org_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          org_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          org_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          agent_id: string | null
          board_column: Database["public"]["Enums"]["board_column"]
          created_at: string
          id: string
          org_id: string
          priority: Database["public"]["Enums"]["task_priority"]
          progress: number | null
          title: string
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          board_column?: Database["public"]["Enums"]["board_column"]
          created_at?: string
          id?: string
          org_id: string
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          board_column?: Database["public"]["Enums"]["board_column"]
          created_at?: string
          id?: string
          org_id?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          progress?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_member: { Args: { _org_id: string }; Returns: boolean }
    }
    Enums: {
      agent_status: "active" | "idle" | "error" | "offline"
      app_role: "admin" | "moderator" | "user"
      board_column: "todo" | "doing" | "input" | "done"
      council_status: "concluded" | "in progress"
      log_category: "observation" | "general" | "reminder" | "fyi"
      meeting_sentiment: "positive" | "neutral" | "mixed"
      task_priority: "low" | "medium" | "high" | "urgent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["active", "idle", "error", "offline"],
      app_role: ["admin", "moderator", "user"],
      board_column: ["todo", "doing", "input", "done"],
      council_status: ["concluded", "in progress"],
      log_category: ["observation", "general", "reminder", "fyi"],
      meeting_sentiment: ["positive", "neutral", "mixed"],
      task_priority: ["low", "medium", "high", "urgent"],
    },
  },
} as const
