export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      cleaned_calls: {
        Row: {
          assigned_operators: string | null;
          call_time: string | null;
          caller_number: string | null;
          caller_state: string | null;
          dateint: number | null;
          day_of_week: number | null;
          dedup_key: string | null;
          duration_seconds: number | null;
          helpline_id: string | null;
          hour_of_day: number | null;
          id: string;
          is_missed_call: number | null;
          month: number | null;
          operator_name: string | null;
          operator_number: string | null;
          year: number | null;
        };
        Insert: {
          assigned_operators?: string | null;
          call_time?: string | null;
          caller_number?: string | null;
          caller_state?: string | null;
          dateint?: number | null;
          day_of_week?: number | null;
          dedup_key?: string | null;
          duration_seconds?: number | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          is_missed_call?: number | null;
          month?: number | null;
          operator_name?: string | null;
          operator_number?: string | null;
          year?: number | null;
        };
        Update: {
          assigned_operators?: string | null;
          call_time?: string | null;
          caller_number?: string | null;
          caller_state?: string | null;
          dateint?: number | null;
          day_of_week?: number | null;
          dedup_key?: string | null;
          duration_seconds?: number | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          is_missed_call?: number | null;
          month?: number | null;
          operator_name?: string | null;
          operator_number?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "cleaned_calls_helpline_id_fkey";
            columns: ["helpline_id"];
            isOneToOne: false;
            referencedRelation: "helplines";
            referencedColumns: ["id"];
          },
        ];
      };
      helplines: {
        Row: {
          anonymized_name: string | null;
          display_name: string | null;
          id: string;
        };
        Insert: {
          anonymized_name?: string | null;
          display_name?: string | null;
          id: string;
        };
        Update: {
          anonymized_name?: string | null;
          display_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      historical_call_cnts: {
        Row: {
          call_cnt: number | null;
          dateint: number | null;
          helpline_id: string | null;
          key: number;
          missed_call_cnt: number | null;
          month_of_year: number | null;
          year: number | null;
        };
        Insert: {
          call_cnt?: number | null;
          dateint?: number | null;
          helpline_id?: string | null;
          key: number;
          missed_call_cnt?: number | null;
          month_of_year?: number | null;
          year?: number | null;
        };
        Update: {
          call_cnt?: number | null;
          dateint?: number | null;
          helpline_id?: string | null;
          key?: number;
          missed_call_cnt?: number | null;
          month_of_year?: number | null;
          year?: number | null;
        };
        Relationships: [];
      };
      hourly_schedule: {
        Row: {
          assigned_operators: string | null;
          day_of_week: number | null;
          dedup_key: string | null;
          helpline_id: string | null;
          hour_of_day: number | null;
          id: string;
          operators_scheduled: number | null;
        };
        Insert: {
          assigned_operators?: string | null;
          day_of_week?: number | null;
          dedup_key?: string | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          operators_scheduled?: number | null;
        };
        Update: {
          assigned_operators?: string | null;
          day_of_week?: number | null;
          dedup_key?: string | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          operators_scheduled?: number | null;
        };
        Relationships: [];
      };
      operator_schedule: {
        Row: {
          day_of_week: number | null;
          dedup_key: string | null;
          helpline_id: string | null;
          hour_of_day: number | null;
          id: string;
          operator_id: string | null;
          operator_name: string | null;
          operator_number: string | null;
        };
        Insert: {
          day_of_week?: number | null;
          dedup_key?: string | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          operator_id?: string | null;
          operator_name?: string | null;
          operator_number?: string | null;
        };
        Update: {
          day_of_week?: number | null;
          dedup_key?: string | null;
          helpline_id?: string | null;
          hour_of_day?: number | null;
          id?: string;
          operator_id?: string | null;
          operator_name?: string | null;
          operator_number?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "operator_schedule_helpline_id_fkey";
            columns: ["helpline_id"];
            isOneToOne: false;
            referencedRelation: "helplines";
            referencedColumns: ["id"];
          },
        ];
      };
      raw_calls: {
        Row: {
          call_number: string | null;
          dedup_key: string | null;
          duration: string | null;
          extension: string | null;
          from_number: string | null;
          helpline_id: string | null;
          id: string;
          start_time: string | null;
          to_number: string | null;
          type: string | null;
          year: number | null;
        };
        Insert: {
          call_number?: string | null;
          dedup_key?: string | null;
          duration?: string | null;
          extension?: string | null;
          from_number?: string | null;
          helpline_id?: string | null;
          id?: string;
          start_time?: string | null;
          to_number?: string | null;
          type?: string | null;
          year?: number | null;
        };
        Update: {
          call_number?: string | null;
          dedup_key?: string | null;
          duration?: string | null;
          extension?: string | null;
          from_number?: string | null;
          helpline_id?: string | null;
          id?: string;
          start_time?: string | null;
          to_number?: string | null;
          type?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "raw_calls_helpline_id_fkey";
            columns: ["helpline_id"];
            isOneToOne: false;
            referencedRelation: "helplines";
            referencedColumns: ["id"];
          },
        ];
      };
      raw_missed_calls: {
        Row: {
          dedup_key: string | null;
          duration: string | null;
          extension: string | null;
          from_number: string | null;
          helpline_id: string | null;
          id: string;
          start_time: string | null;
          to_number: string | null;
          year: number | null;
        };
        Insert: {
          dedup_key?: string | null;
          duration?: string | null;
          extension?: string | null;
          from_number?: string | null;
          helpline_id?: string | null;
          id?: string;
          start_time?: string | null;
          to_number?: string | null;
          year?: number | null;
        };
        Update: {
          dedup_key?: string | null;
          duration?: string | null;
          extension?: string | null;
          from_number?: string | null;
          helpline_id?: string | null;
          id?: string;
          start_time?: string | null;
          to_number?: string | null;
          year?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "raw_missed_calls_helpline_id_fkey";
            columns: ["helpline_id"];
            isOneToOne: false;
            referencedRelation: "helplines";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
