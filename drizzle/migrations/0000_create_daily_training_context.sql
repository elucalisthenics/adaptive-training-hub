CREATE TABLE public.daily_training_context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  context_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  location TEXT NOT NULL DEFAULT 'outdoor',
  surface_type TEXT NOT NULL DEFAULT 'hard',
  available_minutes SMALLINT NOT NULL DEFAULT 70,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT daily_training_context_user_date_key UNIQUE (user_id, context_date),
  CONSTRAINT daily_training_context_location_check CHECK (location IN ('home','gym','outdoor','travel')),
  CONSTRAINT daily_training_context_surface_check CHECK (surface_type IN ('hard','soft','mixed','unknown')),
  CONSTRAINT daily_training_context_minutes_check CHECK (available_minutes BETWEEN 20 AND 180)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_training_context TO authenticated;
GRANT ALL ON public.daily_training_context TO service_role;

ALTER TABLE public.daily_training_context ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own daily training context"
ON public.daily_training_context
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER trg_daily_training_context_updated
BEFORE UPDATE ON public.daily_training_context
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.daily_training_context_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_training_context_id UUID NOT NULL REFERENCES public.daily_training_context(id) ON DELETE CASCADE,
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT daily_training_context_equipment_unique UNIQUE (daily_training_context_id, equipment_id)
);

CREATE INDEX idx_dtce_context ON public.daily_training_context_equipment (daily_training_context_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.daily_training_context_equipment TO authenticated;
GRANT ALL ON public.daily_training_context_equipment TO service_role;

ALTER TABLE public.daily_training_context_equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage equipment of their own daily context"
ON public.daily_training_context_equipment
FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.daily_training_context c
  WHERE c.id = daily_training_context_equipment.daily_training_context_id
    AND c.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.daily_training_context c
  WHERE c.id = daily_training_context_equipment.daily_training_context_id
    AND c.user_id = auth.uid()
));