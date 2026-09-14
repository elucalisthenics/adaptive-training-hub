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

/** Local calendar date as YYYY-MM-DD, used as the daily context key. */
function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
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

/**
 * Today's training context: where the athlete trains today, the ground,
 * available minutes and the equipment actually at hand.
 * Stored in daily_training_context — NOT in workouts. A workouts row must
 * always represent a real, intentionally created session.
 */
export const getTodaySetup = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("daily_training_context")
      .select("id,context_date,location,surface_type,available_minutes")
      .eq("user_id", context.userId)
      .eq("context_date", todayDate())
      .maybeSingle();
    if (error) throw error;
    if (!data) return { context: null, equipmentIds: [] as string[] };

    const eq = await context.supabase
      .from("daily_training_context_equipment")
      .select("equipment_id")
      .eq("daily_training_context_id", data.id);
    if (eq.error) throw eq.error;
    return { context: data, equipmentIds: eq.data.map((r) => r.equipment_id) };
  });

export const saveTodaySetup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        location: z.enum(["home", "gym", "outdoor", "travel"]),
        surface_type: z.enum(["hard", "soft", "mixed", "unknown"]),
        available_minutes: z.number().int().min(20).max(180),
        equipment_ids: z.array(z.string().uuid()).max(50),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const upsert = await context.supabase
      .from("daily_training_context")
      .upsert(
        {
          user_id: context.userId,
          context_date: todayDate(),
          location: data.location,
          surface_type: data.surface_type,
          available_minutes: data.available_minutes,
        },
        { onConflict: "user_id,context_date" },
      )
      .select("id")
      .single();
    if (upsert.error) throw upsert.error;
    const contextId = upsert.data.id;

    const del = await context.supabase
      .from("daily_training_context_equipment")
      .delete()
      .eq("daily_training_context_id", contextId);
    if (del.error) throw del.error;

    if (data.equipment_ids.length > 0) {
      const ins = await context.supabase
        .from("daily_training_context_equipment")
        .insert(
          data.equipment_ids.map((equipment_id) => ({
            daily_training_context_id: contextId,
            equipment_id,
          })),
        );
      if (ins.error) throw ins.error;
    }
    return { ok: true, contextId };
  });

