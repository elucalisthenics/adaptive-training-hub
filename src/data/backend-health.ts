import { supabase } from "@/integrations/supabase/client";

/** Lightweight connectivity check against the backend auth endpoint. */
export async function checkBackendConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { error } = await supabase.auth.getSession();
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "reachable" };
  } catch (err) {
    return { ok: false, message: err instanceof Error ? err.message : "unknown error" };
  }
}
