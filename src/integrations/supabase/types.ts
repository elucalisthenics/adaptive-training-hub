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
      athlete_component_state: {
        Row: {
          component_id: string
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          evidence_count: number
          id: string
          score: number | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          component_id: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          evidence_count?: number
          id?: string
          score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          component_id?: string
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          evidence_count?: number
          id?: string
          score?: number | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_component_state_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "skill_components"
            referencedColumns: ["id"]
          },
        ]
      }
      athlete_exercise_state: {
        Row: {
          created_at: string
          current_band_level: number | null
          current_load_kg: number | null
          current_target_hold_seconds: number | null
          current_target_reps: number | null
          current_target_sets: number | null
          exercise_id: string
          id: string
          last_trained_at: string | null
          negative_session_count: number
          plateau_counter: number
          positive_session_count: number
          state: Database["public"]["Enums"]["exercise_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_band_level?: number | null
          current_load_kg?: number | null
          current_target_hold_seconds?: number | null
          current_target_reps?: number | null
          current_target_sets?: number | null
          exercise_id: string
          id?: string
          last_trained_at?: string | null
          negative_session_count?: number
          plateau_counter?: number
          positive_session_count?: number
          state?: Database["public"]["Enums"]["exercise_state"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          current_band_level?: number | null
          current_load_kg?: number | null
          current_target_hold_seconds?: number | null
          current_target_reps?: number | null
          current_target_sets?: number | null
          exercise_id?: string
          id?: string
          last_trained_at?: string | null
          negative_session_count?: number
          plateau_counter?: number
          positive_session_count?: number
          state?: Database["public"]["Enums"]["exercise_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "athlete_exercise_state_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      exercise_component_relations: {
        Row: {
          component_id: string
          exercise_id: string
          id: string
          relevance: number
        }
        Insert: {
          component_id: string
          exercise_id: string
          id?: string
          relevance: number
        }
        Update: {
          component_id?: string
          exercise_id?: string
          id?: string
          relevance?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercise_component_relations_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "skill_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_component_relations_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_equipment: {
        Row: {
          equipment_id: string
          exercise_id: string
          id: string
          requirement_type: Database["public"]["Enums"]["equipment_requirement_type"]
        }
        Insert: {
          equipment_id: string
          exercise_id: string
          id?: string
          requirement_type?: Database["public"]["Enums"]["equipment_requirement_type"]
        }
        Update: {
          equipment_id?: string
          exercise_id?: string
          id?: string
          requirement_type?: Database["public"]["Enums"]["equipment_requirement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exercise_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_equipment_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_skill_relations: {
        Row: {
          exercise_id: string
          id: string
          relevance: number
          skill_id: string
        }
        Insert: {
          exercise_id: string
          id?: string
          relevance: number
          skill_id: string
        }
        Update: {
          exercise_id?: string
          id?: string
          relevance?: number
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_skill_relations_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_skill_relations_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_training_intents: {
        Row: {
          exercise_id: string
          fit_score: number
          id: string
          training_intent_id: string
        }
        Insert: {
          exercise_id: string
          fit_score: number
          id?: string
          training_intent_id: string
        }
        Update: {
          exercise_id?: string
          fit_score?: number
          id?: string
          training_intent_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_training_intents_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_training_intents_training_intent_id_fkey"
            columns: ["training_intent_id"]
            isOneToOne: false
            referencedRelation: "training_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          active: boolean
          category: string
          created_at: string
          default_rest_seconds: number
          default_rir: number | null
          difficulty: number
          exercise_role: string
          fatigue_cost: number
          id: string
          max_hold_seconds: number | null
          max_reps: number | null
          min_hold_seconds: number | null
          min_reps: number | null
          movement_family: string
          name: string
          rep_type: Database["public"]["Enums"]["rep_type"]
          slug: string
          surface_requirement: Database["public"]["Enums"]["surface_requirement"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          default_rest_seconds?: number
          default_rir?: number | null
          difficulty: number
          exercise_role: string
          fatigue_cost: number
          id?: string
          max_hold_seconds?: number | null
          max_reps?: number | null
          min_hold_seconds?: number | null
          min_reps?: number | null
          movement_family: string
          name: string
          rep_type: Database["public"]["Enums"]["rep_type"]
          slug: string
          surface_requirement?: Database["public"]["Enums"]["surface_requirement"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          default_rest_seconds?: number
          default_rir?: number | null
          difficulty?: number
          exercise_role?: string
          fatigue_cost?: number
          id?: string
          max_hold_seconds?: number | null
          max_reps?: number | null
          min_hold_seconds?: number | null
          min_reps?: number | null
          movement_family?: string
          name?: string
          rep_type?: Database["public"]["Enums"]["rep_type"]
          slug?: string
          surface_requirement?: Database["public"]["Enums"]["surface_requirement"]
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["goal_priority"]
          skill_id: string
          status: Database["public"]["Enums"]["goal_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["goal_priority"]
          skill_id: string
          status?: Database["public"]["Enums"]["goal_status"]
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["goal_priority"]
          skill_id?: string
          status?: Database["public"]["Enums"]["goal_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bodyweight_kg: number | null
          created_at: string
          default_session_minutes: number
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          bodyweight_kg?: number | null
          created_at?: string
          default_session_minutes?: number
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          bodyweight_kg?: number | null
          created_at?: string
          default_session_minutes?: number
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      progression_decisions: {
        Row: {
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          decision_type: Database["public"]["Enums"]["progression_decision_type"]
          exercise_id: string | null
          id: string
          new_prescription_json: Json | null
          previous_prescription_json: Json | null
          reason_code: string | null
          reason_text: string | null
          user_id: string
          workout_id: string | null
        }
        Insert: {
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          decision_type: Database["public"]["Enums"]["progression_decision_type"]
          exercise_id?: string | null
          id?: string
          new_prescription_json?: Json | null
          previous_prescription_json?: Json | null
          reason_code?: string | null
          reason_text?: string | null
          user_id?: string
          workout_id?: string | null
        }
        Update: {
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          decision_type?: Database["public"]["Enums"]["progression_decision_type"]
          exercise_id?: string | null
          id?: string
          new_prescription_json?: Json | null
          previous_prescription_json?: Json | null
          reason_code?: string | null
          reason_text?: string | null
          user_id?: string
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progression_decisions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progression_decisions_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_components: {
        Row: {
          created_at: string
          id: string
          name: string
          skill_id: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          skill_id: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          skill_id?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "skill_components_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      training_intents: {
        Row: {
          created_at: string
          id: string
          movement_family: string | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          movement_family?: string | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          movement_family?: string | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      user_equipment: {
        Row: {
          availability_type: Database["public"]["Enums"]["availability_type"]
          created_at: string
          equipment_id: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          availability_type?: Database["public"]["Enums"]["availability_type"]
          created_at?: string
          equipment_id: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          availability_type?: Database["public"]["Enums"]["availability_type"]
          created_at?: string
          equipment_id?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      weak_points: {
        Row: {
          component_id: string | null
          confidence: Database["public"]["Enums"]["confidence_level"]
          created_at: string
          id: string
          severity: number | null
          skill_id: string | null
          status: Database["public"]["Enums"]["weak_point_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          component_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          id?: string
          severity?: number | null
          skill_id?: string | null
          status?: Database["public"]["Enums"]["weak_point_status"]
          updated_at?: string
          user_id?: string
        }
        Update: {
          component_id?: string | null
          confidence?: Database["public"]["Enums"]["confidence_level"]
          created_at?: string
          id?: string
          severity?: number | null
          skill_id?: string | null
          status?: Database["public"]["Enums"]["weak_point_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weak_points_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "skill_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weak_points_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_available_equipment: {
        Row: {
          equipment_id: string
          id: string
          workout_id: string
        }
        Insert: {
          equipment_id: string
          id?: string
          workout_id: string
        }
        Update: {
          equipment_id?: string
          id?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_available_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_available_equipment_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string
          estimated_minutes: number | null
          exercise_id: string
          id: string
          priority: number | null
          rest_seconds: number | null
          role: string | null
          skip_reason: string | null
          slot_order: number
          status: Database["public"]["Enums"]["workout_exercise_status"]
          substituted_from_exercise_id: string | null
          target_hold_seconds: number | null
          target_reps: number | null
          target_rir: number | null
          target_sets: number | null
          training_intent_id: string | null
          updated_at: string
          workout_id: string
        }
        Insert: {
          created_at?: string
          estimated_minutes?: number | null
          exercise_id: string
          id?: string
          priority?: number | null
          rest_seconds?: number | null
          role?: string | null
          skip_reason?: string | null
          slot_order: number
          status?: Database["public"]["Enums"]["workout_exercise_status"]
          substituted_from_exercise_id?: string | null
          target_hold_seconds?: number | null
          target_reps?: number | null
          target_rir?: number | null
          target_sets?: number | null
          training_intent_id?: string | null
          updated_at?: string
          workout_id: string
        }
        Update: {
          created_at?: string
          estimated_minutes?: number | null
          exercise_id?: string
          id?: string
          priority?: number | null
          rest_seconds?: number | null
          role?: string | null
          skip_reason?: string | null
          slot_order?: number
          status?: Database["public"]["Enums"]["workout_exercise_status"]
          substituted_from_exercise_id?: string | null
          target_hold_seconds?: number | null
          target_reps?: number | null
          target_rir?: number | null
          target_sets?: number | null
          training_intent_id?: string | null
          updated_at?: string
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_substituted_from_exercise_id_fkey"
            columns: ["substituted_from_exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_training_intent_id_fkey"
            columns: ["training_intent_id"]
            isOneToOne: false
            referencedRelation: "training_intents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          actual_hold_seconds: number | null
          actual_reps: number | null
          band_level: number | null
          completed: boolean
          created_at: string
          id: string
          load_kg: number | null
          pain: Database["public"]["Enums"]["set_pain"] | null
          rir: number | null
          rom: Database["public"]["Enums"]["set_rom"] | null
          set_number: number
          target_hold_seconds: number | null
          target_reps: number | null
          technique: Database["public"]["Enums"]["set_technique"] | null
          updated_at: string
          workout_exercise_id: string
        }
        Insert: {
          actual_hold_seconds?: number | null
          actual_reps?: number | null
          band_level?: number | null
          completed?: boolean
          created_at?: string
          id?: string
          load_kg?: number | null
          pain?: Database["public"]["Enums"]["set_pain"] | null
          rir?: number | null
          rom?: Database["public"]["Enums"]["set_rom"] | null
          set_number: number
          target_hold_seconds?: number | null
          target_reps?: number | null
          technique?: Database["public"]["Enums"]["set_technique"] | null
          updated_at?: string
          workout_exercise_id: string
        }
        Update: {
          actual_hold_seconds?: number | null
          actual_reps?: number | null
          band_level?: number | null
          completed?: boolean
          created_at?: string
          id?: string
          load_kg?: number | null
          pain?: Database["public"]["Enums"]["set_pain"] | null
          rir?: number | null
          rom?: Database["public"]["Enums"]["set_rom"] | null
          set_number?: number
          target_hold_seconds?: number | null
          target_reps?: number | null
          technique?: Database["public"]["Enums"]["set_technique"] | null
          updated_at?: string
          workout_exercise_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          actual_duration_minutes: number | null
          created_at: string
          environment_type: string | null
          finished_at: string | null
          id: string
          planned_at: string | null
          planned_duration_minutes: number | null
          readiness_energy: number | null
          readiness_motivation: number | null
          readiness_pain: number | null
          readiness_sleep: number | null
          readiness_soreness: number | null
          started_at: string | null
          status: Database["public"]["Enums"]["workout_status"]
          surface_type: string | null
          updated_at: string
          user_id: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Insert: {
          actual_duration_minutes?: number | null
          created_at?: string
          environment_type?: string | null
          finished_at?: string | null
          id?: string
          planned_at?: string | null
          planned_duration_minutes?: number | null
          readiness_energy?: number | null
          readiness_motivation?: number | null
          readiness_pain?: number | null
          readiness_sleep?: number | null
          readiness_soreness?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workout_status"]
          surface_type?: string | null
          updated_at?: string
          user_id?: string
          workout_type: Database["public"]["Enums"]["workout_type"]
        }
        Update: {
          actual_duration_minutes?: number | null
          created_at?: string
          environment_type?: string | null
          finished_at?: string | null
          id?: string
          planned_at?: string | null
          planned_duration_minutes?: number | null
          readiness_energy?: number | null
          readiness_motivation?: number | null
          readiness_pain?: number | null
          readiness_sleep?: number | null
          readiness_soreness?: number | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["workout_status"]
          surface_type?: string | null
          updated_at?: string
          user_id?: string
          workout_type?: Database["public"]["Enums"]["workout_type"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      availability_type: "always" | "sometimes" | "gym_only" | "home_only"
      confidence_level: "low" | "medium" | "high"
      equipment_requirement_type: "required" | "optional"
      exercise_state:
        | "learning"
        | "building"
        | "ready_to_progress"
        | "progression_test"
        | "mastered"
        | "plateau"
        | "regression"
        | "maintenance"
      goal_priority: "primary" | "secondary" | "maintenance"
      goal_status: "active" | "paused" | "achieved" | "abandoned"
      progression_decision_type:
        | "progress"
        | "maintain"
        | "regress"
        | "deload"
        | "substitute"
        | "change_volume"
        | "change_intensity"
      rep_type: "reps" | "hold" | "practice"
      set_pain: "none" | "mild" | "significant"
      set_rom: "partial" | "mostly_full" | "full"
      set_technique: "poor" | "acceptable" | "good" | "excellent"
      surface_requirement:
        | "any"
        | "soft_preferred"
        | "soft_required"
        | "elevated_support"
        | "wall_required"
      weak_point_status: "suspected" | "confirmed" | "improving" | "resolved"
      workout_exercise_status:
        | "planned"
        | "completed"
        | "partial"
        | "skipped"
        | "substituted"
        | "stopped"
      workout_status:
        | "planned"
        | "in_progress"
        | "completed"
        | "partial"
        | "cancelled"
      workout_type:
        | "push_heavy"
        | "pull_heavy"
        | "push_volume"
        | "pull_volume"
        | "skills"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      availability_type: ["always", "sometimes", "gym_only", "home_only"],
      confidence_level: ["low", "medium", "high"],
      equipment_requirement_type: ["required", "optional"],
      exercise_state: [
        "learning",
        "building",
        "ready_to_progress",
        "progression_test",
        "mastered",
        "plateau",
        "regression",
        "maintenance",
      ],
      goal_priority: ["primary", "secondary", "maintenance"],
      goal_status: ["active", "paused", "achieved", "abandoned"],
      progression_decision_type: [
        "progress",
        "maintain",
        "regress",
        "deload",
        "substitute",
        "change_volume",
        "change_intensity",
      ],
      rep_type: ["reps", "hold", "practice"],
      set_pain: ["none", "mild", "significant"],
      set_rom: ["partial", "mostly_full", "full"],
      set_technique: ["poor", "acceptable", "good", "excellent"],
      surface_requirement: [
        "any",
        "soft_preferred",
        "soft_required",
        "elevated_support",
        "wall_required",
      ],
      weak_point_status: ["suspected", "confirmed", "improving", "resolved"],
      workout_exercise_status: [
        "planned",
        "completed",
        "partial",
        "skipped",
        "substituted",
        "stopped",
      ],
      workout_status: [
        "planned",
        "in_progress",
        "completed",
        "partial",
        "cancelled",
      ],
      workout_type: [
        "push_heavy",
        "pull_heavy",
        "push_volume",
        "pull_volume",
        "skills",
      ],
    },
  },
} as const
