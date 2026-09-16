import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Client-side auth gate. The session lives in browser storage only, so the
 * check runs after mount instead of in beforeLoad: an async router redirect
 * during hydration produced React "state update before mount" warnings.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<"checking" | "allowed">("checking");

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) setState("allowed");
      else navigate({ to: "/auth", replace: true });
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  if (state === "checking") {
    return <div className="min-h-screen bg-background" aria-busy="true" />;
  }

  return <Outlet />;
}
