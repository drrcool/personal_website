export type Json =
  | string
  | number
  | boolean
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
          assigned_operators: string;
          call_time: string;
          caller_number: string;
          caller_state: string;
          dateint: number;
          day_of_week: number;
          dedup_key: string;
          duration_seconds: number;
          helpline_id: string;
          hour_of_day: number;
          id: string;
          is_missed_call: number;
          month: number;
          operator_name: string;
          operator_number: string;
          year: number;
        };
        Insert: {
          assigned_operators: string;
          call_time: string;
          caller_number: string;
          caller_state?: string;
          dateint: number;
          day_of_week: number;
          dedup_key: string;
          duration_seconds: number;
          helpline_id: string;
          hour_of_day: number;
          id?: string;
          is_missed_call: number;
          month: number;
          operator_name: string;
          operator_number: string;
          year: number;
        };
        Update: {
          assigned_operators?: string;
          call_time?: string;
          caller_number?: string;
          caller_state?: string;
          dateint?: number;
          day_of_week?: number;
          dedup_key?: string;
          duration_seconds?: number;
          helpline_id?: string;
          hour_of_day?: number;
          id?: string;
          is_missed_call?: number;
          month?: number;
          operator_name?: string;
          operator_number?: string;
          year?: number;
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
          anonymized_name: string;
          display_name: string;
          id: string;
        };
        Insert: {
          anonymized_name?: string;
          display_name?: string;
          id: string;
        };
        Update: {
          anonymized_name?: string;
          display_name?: string;
          id?: string;
        };
        Relationships: [];
      };
      historical_call_cnts: {
        Row: {
          call_cnt: number;
          dateint: number;
          helpline_id: string;
          key: number;
          missed_call_cnt: number;
          month_of_year: number;
          year: number;
        };
        Insert: {
          call_cnt: number;
          dateint: number;
          helpline_id: string;
          key: number;
          missed_call_cnt: number;
          month_of_year: number;
          year: number;
        };
        Update: {
          call_cnt?: number;
          dateint?: number;
          helpline_id?: string;
          key?: number;
          missed_call_cnt?: number;
          month_of_year?: number;
          year?: number;
        };
        Relationships: [];
      };
      hourly_schedule: {
        Row: {
          assigned_operators: string;
          day_of_week: number;
          dedup_key: string;
          helpline_id: string;
          hour_of_day: number;
          id: string;
          operators_scheduled: number;
        };
        Insert: {
          assigned_operators: string;
          day_of_week: number;
          dedup_key: string;
          helpline_id: string;
          hour_of_day: number;
          id?: string;
          operators_scheduled: number;
        };
        Update: {
          assigned_operators?: string;
          day_of_week?: number;
          dedup_key?: string;
          helpline_id?: string;
          hour_of_day?: number;
          id?: string;
          operators_scheduled?: number;
        };
        Relationships: [];
      };
      operator_schedule: {
        Row: {
          day_of_week: number;
          dedup_key: string;
          helpline_id: string;
          hour_of_day: number;
          id: string;
          operator_id: string;
          operator_name: string;
          operator_number: string;
        };
        Insert: {
          day_of_week: number;
          dedup_key?: string;
          helpline_id: string;
          hour_of_day: number;
          id?: string;
          operator_id: string;
          operator_name: string;
          operator_number: string;
        };
        Update: {
          day_of_week?: number;
          dedup_key?: string;
          helpline_id?: string;
          hour_of_day?: number;
          id?: string;
          operator_id?: string;
          operator_name?: string;
          operator_number?: string;
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
          call_number: string;
          dedup_key: string;
          duration: string;
          extension: string;
          from_number: string;
          helpline_id: string;
          id: string;
          start_time: string;
          to_number: string;
          type: string;
          year: number;
        };
        Insert: {
          call_number?: string;
          dedup_key?: string;
          duration?: string;
          extension?: string;
          from_number?: string;
          helpline_id?: string;
          id?: string;
          start_time?: string;
          to_number?: string;
          type?: string;
          year?: number;
        };
        Update: {
          call_number?: string;
          dedup_key?: string;
          duration?: string;
          extension?: string;
          from_number?: string;
          helpline_id?: string;
          id?: string;
          start_time?: string;
          to_number?: string;
          type?: string;
          year?: number;
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
          dedup_key: string;
          duration: string;
          extension: string;
          from_number: string;
          helpline_id: string;
          id: string;
          start_time: string;
          to_number: string;
          year: number;
        };
        Insert: {
          dedup_key?: string;
          duration?: string;
          extension?: string;
          from_number?: string;
          helpline_id?: string;
          id?: string;
          start_time?: string;
          to_number?: string;
          year?: number;
        };
        Update: {
          dedup_key?: string;
          duration?: string;
          extension?: string;
          from_number?: string;
          helpline_id?: string;
          id?: string;
          start_time?: string;
          to_number?: string;
          year?: number;
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
      calls_time_series: {
        Row: {
          assigned_missed_call: number;
          call_cnt: number;
          dateint: number;
          helpline_id: string;
          month: number;
          unassigned_missed_call: number;
          year: number;
        };
        Relationships: [];
      };
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
