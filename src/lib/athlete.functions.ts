import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Data access for athlete setup (profile, goals, usual equipment) and
 * today's environment/equipment selection.
 * No training logic lives here — only reads and writes.
 */

const availability = z.enum(["always", "sometimes", "gym_only", "home_only"]);
const priority = z.enum(["primary", "secondary", "maintenance"]);

function startOfTodayIso() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function endOfTodayIso() {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

/** Reference data needed by the setup screens. */
export const getReferenceData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [skills, equipment] = await Promise.all([
      context.supabase.from("skills").select("id,name,slug").order("name"),
      context.supabase.from("equipment").select("id,name,slug").order("name"),
    ]);
    if (skills.error) throw skills.error;
    if (equipment.error) throw equipment.error;
    return { skills: skills.data, equipment: equipment.data };
  });

/** Everything the athlete has configured so far. */
export const getAthleteSetup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [profile, goals, userEquipment] = await Promise.all([
      context.supabase
        .from("profiles")
        .select("id,display_name,bodyweight_kg,default_session_minutes")
        .eq("id", context.userId)
        .maybeSingle(),
      context.supabase
        .from("goals")
        .select("id,skill_id,priority,status")
        .eq("user_id", context.userId)
        .eq("status", "active"),
      context.supabase
        .from("user_equipment")
        .select("id,equipment_id,availability_type")
        .eq("user_id", context.userId),
    ]);
    if (profile.error) throw profile.error;
    if (goals.error) throw goals.error;
    if (userEquipment.error) throw userEquipment.error;
    return {
      profile: profile.data,
      goals: goals.data,
      equipment: userEquipment.data,
    };
  });

export const saveProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        display_name: z.string().trim().min(1).max(80),
        bodyweight_kg: z.number().min(20).max(250).nullable(),
        default_session_minutes: z.number().int().min(20).max(180),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...data }, { onConflict: "id" });
    if (error) throw error;
    return { ok: true };
  });

export const saveGoals = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        goals: z.array(z.object({ skill_id: z.string().uuid(), priority })).max(12),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const del = await context.supabase
      .from("goals")
      .delete()
      .eq("user_id", context.userId)
      .eq("status", "active");
    if (del.error) throw del.error;

    if (data.goals.length > 0) {
      const ins = await context.supabase.from("goals").insert(
        data.goals.map((g) => ({
          user_id: context.userId,
          skill_id: g.skill_id,
          priority: g.priority,
          status: "active" as const,
        })),
      );
      if (ins.error) throw ins.error;
    }
    return { ok: true };
  });

export const saveEquipment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        items: z
          .array(z.object({ equipment_id: z.string().uuid(), availability_type: availability }))
          .max(50),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const del = await context.supabase
      .from("user_equipment")
      .delete()
      .eq("user_id", context.userId);
    if (del.error) throw del.error;

    if (data.items.length > 0) {
      const ins = await context.supabase
        .from("user_equipment")
        .insert(data.items.map((i) => ({ user_id: context.userId, ...i })));
      if (ins.error) throw ins.error;
    }
    return { ok: true };
  });

/** Today's planned session context: environment, surface and available equipment. */
export const getTodaySetup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("workouts")
      .select("id,environment_type,surface_type,planned_duration_minutes,status,planned_at")
      .eq("user_id", context.userId)
      .gte("planned_at", startOfTodayIso())
      .lte("planned_at", endOfTodayIso())
      .order("planned_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!data) return { workout: null, equipmentIds: [] as string[] };

    const eq = await context.supabase
      .from("workout_available_equipment")
      .select("equipment_id")
      .eq("workout_id", data.id);
    if (eq.error) throw eq.error;
    return { workout: data, equipmentIds: eq.data.map((r) => r.equipment_id) };
  });

export const saveTodaySetup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        environment_type: z.enum(["home", "gym", "outdoor", "travel"]),
        surface_type: z.enum(["hard", "soft", "mixed", "unknown"]),
        planned_duration_minutes: z.number().int().min(20).max(180),
        equipment_ids: z.array(z.string().uuid()).max(50),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const existing = await context.supabase
      .from("workouts")
      .select("id")
      .eq("user_id", context.userId)
      .gte("planned_at", startOfTodayIso())
      .lte("planned_at", endOfTodayIso())
      .order("planned_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing.error) throw existing.error;

    const fields = {
      environment_type: data.environment_type,
      surface_type: data.surface_type,
      planned_duration_minutes: data.planned_duration_minutes,
    };

    let workoutId = existing.data?.id;
    if (workoutId) {
      const upd = await context.supabase.from("workouts").update(fields).eq("id", workoutId);
      if (upd.error) throw upd.error;
    } else {
      const ins = await context.supabase
        .from("workouts")
        .insert({
          user_id: context.userId,
          workout_type: "pull_heavy" as const,
          status: "planned" as const,
          planned_at: new Date().toISOString(),
          ...fields,
        })
        .select("id")
        .single();
      if (ins.error) throw ins.error;
      workoutId = ins.data.id;
    }

    const del = await context.supabase
      .from("workout_available_equipment")
      .delete()
      .eq("workout_id", workoutId);
    if (del.error) throw del.error;

    if (data.equipment_ids.length > 0) {
      const ins = await context.supabase
        .from("workout_available_equipment")
        .insert(data.equipment_ids.map((equipment_id) => ({ workout_id: workoutId!, equipment_id })));
      if (ins.error) throw ins.error;
    }
    return { ok: true, workoutId };
  });
