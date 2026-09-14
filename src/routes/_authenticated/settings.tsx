import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { AppShell } from "@/components/layout/AppShell";
import { checkBackendConnection } from "@/data/backend-health";
import { EquipmentForm, GoalsForm, ProfileForm } from "@/components/setup/AthleteSetupForms";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Adaptive Calisthenics Training" },
      {
        name: "description",
        content: "Training preferences, equipment, environment and backend status.",
      },
      { property: "og:title", content: "Settings — Adaptive Calisthenics Training" },
      {
        property: "og:description",
        content: "Preferences, equipment, environment and backend status.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["backend-health"],
    queryFn: checkBackendConnection,
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell title="Settings">
      <h1 className="text-3xl font-semibold uppercase tracking-wide">Settings</h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        Your athlete profile, training goals and the equipment you usually have. Today&rsquo;s
        session setup lives on the Today page.
      </p>

      <div className="mt-6 space-y-4">
        <ProfileForm />
        <GoalsForm />
        <EquipmentForm />
      </div>

      <section className="mt-8 rounded-lg border border-border bg-surface p-4">
        <p className="label-caps">Backend</p>
        <p className="mt-2 text-sm">
          {isPending
            ? "Checking connection…"
            : data?.ok
              ? "Connected and reachable"
              : `Unreachable: ${data?.message}`}
        </p>
      </section>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-6 min-h-12 w-full rounded-md border border-border bg-surface text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign out
      </button>
    </AppShell>
  );
}
