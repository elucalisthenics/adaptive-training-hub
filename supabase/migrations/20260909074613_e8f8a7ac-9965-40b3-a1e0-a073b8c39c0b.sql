-- ============ ENUM TYPES ============
CREATE TYPE public.availability_type AS ENUM ('always','sometimes','gym_only','home_only');
CREATE TYPE public.goal_priority AS ENUM ('primary','secondary','maintenance');
CREATE TYPE public.goal_status AS ENUM ('active','paused','achieved','abandoned');
CREATE TYPE public.rep_type AS ENUM ('reps','hold','practice');
CREATE TYPE public.surface_requirement AS ENUM ('any','soft_preferred','soft_required','elevated_support','wall_required');
CREATE TYPE public.equipment_requirement_type AS ENUM ('required','optional');
CREATE TYPE public.workout_type AS ENUM ('push_heavy','pull_heavy','push_volume','pull_volume','skills');
CREATE TYPE public.workout_status AS ENUM ('planned','in_progress','completed','partial','cancelled');
CREATE TYPE public.workout_exercise_status AS ENUM ('planned','completed','partial','skipped','substituted','stopped');
CREATE TYPE public.set_technique AS ENUM ('poor','acceptable','good','excellent');
CREATE TYPE public.set_rom AS ENUM ('partial','mostly_full','full');
CREATE TYPE public.set_pain AS ENUM ('none','mild','significant');
CREATE TYPE public.exercise_state AS ENUM ('learning','building','ready_to_progress','progression_test','mastered','plateau','regression','maintenance');
CREATE TYPE public.confidence_level AS ENUM ('low','medium','high');
CREATE TYPE public.weak_point_status AS ENUM ('suspected','confirmed','improving','resolved');
CREATE TYPE public.progression_decision_type AS ENUM ('progress','maintain','regress','deload','substitute','change_volume','change_intensity');

-- ============ SHARED updated_at TRIGGER ============
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  display_name TEXT,
  bodyweight_kg NUMERIC(5,2) CHECK (bodyweight_kg IS NULL OR bodyweight_kg > 0),
  default_session_minutes INTEGER NOT NULL DEFAULT 70 CHECK (default_session_minutes BETWEEN 10 AND 240),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ REFERENCE: EQUIPMENT ============
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.equipment TO authenticated;
GRANT ALL ON public.equipment TO service_role;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.equipment FOR SELECT TO authenticated USING (true);

-- ============ REFERENCE: SKILLS ============
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.skills FOR SELECT TO authenticated USING (true);

CREATE TABLE public.skill_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (skill_id, slug)
);
GRANT SELECT ON public.skill_components TO authenticated;
GRANT ALL ON public.skill_components TO service_role;
ALTER TABLE public.skill_components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.skill_components FOR SELECT TO authenticated USING (true);

-- ============ REFERENCE: TRAINING INTENTS ============
CREATE TABLE public.training_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  movement_family TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.training_intents TO authenticated;
GRANT ALL ON public.training_intents TO service_role;
ALTER TABLE public.training_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.training_intents FOR SELECT TO authenticated USING (true);

-- ============ REFERENCE: EXERCISES ============
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  movement_family TEXT NOT NULL,
  exercise_role TEXT NOT NULL,
  difficulty SMALLINT NOT NULL CHECK (difficulty BETWEEN 1 AND 10),
  rep_type public.rep_type NOT NULL,
  min_reps SMALLINT CHECK (min_reps IS NULL OR min_reps >= 0),
  max_reps SMALLINT CHECK (max_reps IS NULL OR max_reps >= 0),
  min_hold_seconds SMALLINT CHECK (min_hold_seconds IS NULL OR min_hold_seconds >= 0),
  max_hold_seconds SMALLINT CHECK (max_hold_seconds IS NULL OR max_hold_seconds >= 0),
  default_rir SMALLINT CHECK (default_rir IS NULL OR default_rir BETWEEN 0 AND 5),
  default_rest_seconds SMALLINT NOT NULL DEFAULT 120 CHECK (default_rest_seconds BETWEEN 0 AND 600),
  fatigue_cost SMALLINT NOT NULL CHECK (fatigue_cost BETWEEN 1 AND 4),
  surface_requirement public.surface_requirement NOT NULL DEFAULT 'any',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.exercises TO authenticated;
GRANT ALL ON public.exercises TO service_role;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.exercises FOR SELECT TO authenticated USING (true);
CREATE TRIGGER trg_exercises_updated BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.exercise_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  requirement_type public.equipment_requirement_type NOT NULL DEFAULT 'required',
  UNIQUE (exercise_id, equipment_id)
);
GRANT SELECT ON public.exercise_equipment TO authenticated;
GRANT ALL ON public.exercise_equipment TO service_role;
ALTER TABLE public.exercise_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.exercise_equipment FOR SELECT TO authenticated USING (true);

CREATE TABLE public.exercise_skill_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  relevance SMALLINT NOT NULL CHECK (relevance BETWEEN 0 AND 30),
  UNIQUE (exercise_id, skill_id)
);
GRANT SELECT ON public.exercise_skill_relations TO authenticated;
GRANT ALL ON public.exercise_skill_relations TO service_role;
ALTER TABLE public.exercise_skill_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.exercise_skill_relations FOR SELECT TO authenticated USING (true);

CREATE TABLE public.exercise_component_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES public.skill_components(id) ON DELETE CASCADE,
  relevance SMALLINT NOT NULL CHECK (relevance BETWEEN 0 AND 25),
  UNIQUE (exercise_id, component_id)
);
GRANT SELECT ON public.exercise_component_relations TO authenticated;
GRANT ALL ON public.exercise_component_relations TO service_role;
ALTER TABLE public.exercise_component_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.exercise_component_relations FOR SELECT TO authenticated USING (true);

CREATE TABLE public.exercise_training_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  training_intent_id UUID NOT NULL REFERENCES public.training_intents(id) ON DELETE CASCADE,
  fit_score SMALLINT NOT NULL CHECK (fit_score BETWEEN 0 AND 20),
  UNIQUE (exercise_id, training_intent_id)
);
GRANT SELECT ON public.exercise_training_intents TO authenticated;
GRANT ALL ON public.exercise_training_intents TO service_role;
ALTER TABLE public.exercise_training_intents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reference readable by authenticated" ON public.exercise_training_intents FOR SELECT TO authenticated USING (true);

-- ============ USER-OWNED: EQUIPMENT / GOALS ============
CREATE TABLE public.user_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  availability_type public.availability_type NOT NULL DEFAULT 'always',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, equipment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_equipment TO authenticated;
GRANT ALL ON public.user_equipment TO service_role;
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own equipment" ON public.user_equipment FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_user_equipment_updated BEFORE UPDATE ON public.user_equipment
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  priority public.goal_priority NOT NULL DEFAULT 'secondary',
  status public.goal_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own goals" ON public.goals FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============ USER-OWNED: WORKOUTS ============
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  workout_type public.workout_type NOT NULL,
  status public.workout_status NOT NULL DEFAULT 'planned',
  planned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ,
  planned_duration_minutes SMALLINT CHECK (planned_duration_minutes IS NULL OR planned_duration_minutes BETWEEN 0 AND 300),
  actual_duration_minutes SMALLINT CHECK (actual_duration_minutes IS NULL OR actual_duration_minutes BETWEEN 0 AND 300),
  environment_type TEXT,
  surface_type TEXT,
  readiness_energy SMALLINT CHECK (readiness_energy IS NULL OR readiness_energy BETWEEN 1 AND 5),
  readiness_soreness SMALLINT CHECK (readiness_soreness IS NULL OR readiness_soreness BETWEEN 1 AND 5),
  readiness_motivation SMALLINT CHECK (readiness_motivation IS NULL OR readiness_motivation BETWEEN 1 AND 5),
  readiness_sleep SMALLINT CHECK (readiness_sleep IS NULL OR readiness_sleep BETWEEN 1 AND 5),
  readiness_pain SMALLINT CHECK (readiness_pain IS NULL OR readiness_pain BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workouts" ON public.workouts FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_workouts_updated BEFORE UPDATE ON public.workouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_workouts_user_planned ON public.workouts (user_id, planned_at DESC);

CREATE TABLE public.workout_available_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  UNIQUE (workout_id, equipment_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_available_equipment TO authenticated;
GRANT ALL ON public.workout_available_equipment TO service_role;
ALTER TABLE public.workout_available_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workout equipment" ON public.workout_available_equipment FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()));

CREATE TABLE public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  training_intent_id UUID REFERENCES public.training_intents(id) ON DELETE SET NULL,
  slot_order SMALLINT NOT NULL,
  role TEXT,
  priority SMALLINT CHECK (priority IS NULL OR priority BETWEEN 1 AND 10),
  target_sets SMALLINT CHECK (target_sets IS NULL OR target_sets BETWEEN 0 AND 20),
  target_reps SMALLINT CHECK (target_reps IS NULL OR target_reps >= 0),
  target_hold_seconds SMALLINT CHECK (target_hold_seconds IS NULL OR target_hold_seconds >= 0),
  target_rir SMALLINT CHECK (target_rir IS NULL OR target_rir BETWEEN 0 AND 5),
  rest_seconds SMALLINT CHECK (rest_seconds IS NULL OR rest_seconds BETWEEN 0 AND 600),
  estimated_minutes SMALLINT CHECK (estimated_minutes IS NULL OR estimated_minutes BETWEEN 0 AND 120),
  status public.workout_exercise_status NOT NULL DEFAULT 'planned',
  substituted_from_exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  skip_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workout_id, slot_order)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_exercises TO authenticated;
GRANT ALL ON public.workout_exercises TO service_role;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workout exercises" ON public.workout_exercises FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND w.user_id = auth.uid()));
CREATE TRIGGER trg_workout_exercises_updated BEFORE UPDATE ON public.workout_exercises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number SMALLINT NOT NULL CHECK (set_number > 0),
  target_reps SMALLINT CHECK (target_reps IS NULL OR target_reps >= 0),
  actual_reps SMALLINT CHECK (actual_reps IS NULL OR actual_reps >= 0),
  target_hold_seconds SMALLINT CHECK (target_hold_seconds IS NULL OR target_hold_seconds >= 0),
  actual_hold_seconds SMALLINT CHECK (actual_hold_seconds IS NULL OR actual_hold_seconds >= 0),
  load_kg NUMERIC(5,2),
  band_level SMALLINT CHECK (band_level IS NULL OR band_level BETWEEN 0 AND 10),
  rir SMALLINT CHECK (rir IS NULL OR rir BETWEEN 0 AND 10),
  technique public.set_technique,
  rom public.set_rom,
  pain public.set_pain,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workout_exercise_id, set_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sets TO authenticated;
GRANT ALL ON public.workout_sets TO service_role;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own workout sets" ON public.workout_sets FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.workout_exercises we
    JOIN public.workouts w ON w.id = we.workout_id
    WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.workout_exercises we
    JOIN public.workouts w ON w.id = we.workout_id
    WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()));
CREATE TRIGGER trg_workout_sets_updated BEFORE UPDATE ON public.workout_sets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ USER-OWNED: STATE / ANALYSIS ============
CREATE TABLE public.athlete_exercise_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  state public.exercise_state NOT NULL DEFAULT 'learning',
  current_target_sets SMALLINT,
  current_target_reps SMALLINT,
  current_target_hold_seconds SMALLINT,
  current_load_kg NUMERIC(5,2),
  current_band_level SMALLINT,
  positive_session_count INTEGER NOT NULL DEFAULT 0,
  negative_session_count INTEGER NOT NULL DEFAULT 0,
  plateau_counter INTEGER NOT NULL DEFAULT 0,
  last_trained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, exercise_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.athlete_exercise_state TO authenticated;
GRANT ALL ON public.athlete_exercise_state TO service_role;
ALTER TABLE public.athlete_exercise_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own exercise state" ON public.athlete_exercise_state FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_aes_updated BEFORE UPDATE ON public.athlete_exercise_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.athlete_component_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  component_id UUID NOT NULL REFERENCES public.skill_components(id) ON DELETE CASCADE,
  score NUMERIC(5,2) CHECK (score IS NULL OR score BETWEEN 0 AND 100),
  confidence public.confidence_level NOT NULL DEFAULT 'low',
  status TEXT,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, component_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.athlete_component_state TO authenticated;
GRANT ALL ON public.athlete_component_state TO service_role;
ALTER TABLE public.athlete_component_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own component state" ON public.athlete_component_state FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_acs_updated BEFORE UPDATE ON public.athlete_component_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.weak_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  component_id UUID REFERENCES public.skill_components(id) ON DELETE CASCADE,
  severity SMALLINT CHECK (severity IS NULL OR severity BETWEEN 1 AND 5),
  confidence public.confidence_level NOT NULL DEFAULT 'low',
  status public.weak_point_status NOT NULL DEFAULT 'suspected',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weak_points TO authenticated;
GRANT ALL ON public.weak_points TO service_role;
ALTER TABLE public.weak_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weak points" ON public.weak_points FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_weak_points_updated BEFORE UPDATE ON public.weak_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.progression_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid(),
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE SET NULL,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  decision_type public.progression_decision_type NOT NULL,
  previous_prescription_json JSONB,
  new_prescription_json JSONB,
  reason_code TEXT,
  reason_text TEXT,
  confidence public.confidence_level NOT NULL DEFAULT 'low',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progression_decisions TO authenticated;
GRANT ALL ON public.progression_decisions TO service_role;
ALTER TABLE public.progression_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progression decisions" ON public.progression_decisions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);