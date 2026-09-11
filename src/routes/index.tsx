import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adaptive Calisthenics Training" },
      {
        name: "description",
        content:
          "A personal adaptive calisthenics training tool: goals, equipment, sessions and progress.",
      },
      { property: "og:title", content: "Adaptive Calisthenics Training" },
      {
        property: "og:description",
        content: "Personal adaptive calisthenics training: goals, equipment, sessions and progress.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) navigate({ to: "/today", replace: true });
      else setChecked(true);
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="label-caps text-muted-foreground">Personal training tool</p>
        <h1 className="mt-2 font-display text-5xl font-semibold uppercase tracking-wide">
          Adaptive Calisthenics
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Goals, equipment, environment and sessions in one place. Built for serious, repeatable
          training — not for scrolling.
        </p>
        {checked && (
          <Link
            to="/auth"
            className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign in
          </Link>
        )}
      </div>
    </main>
  );
}
