import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import {
  EquipmentForm,
  GoalsForm,
  ProfileForm,
  useSetupData,
} from "@/components/setup/AthleteSetupForms";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Setup — Adaptive Calisthenics Training" },
      { name: "description", content: "Create your athlete profile, goals and usual equipment." },
      { property: "og:title", content: "Setup — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Athlete profile, training goals and equipment setup." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { setupQuery } = useSetupData();
  const hasProfile = Boolean(setupQuery.data?.profile);

  return (
    <AppShell title="Setup">
      <h1 className="text-3xl font-semibold uppercase tracking-wide">First-time setup</h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        Three steps: who you are, what you are training for, and what equipment you usually have.
        Everything can be changed later in Settings.
      </p>

      <div className="mt-6 space-y-4">
        <ProfileForm />
        <GoalsForm />
        <EquipmentForm />
      </div>

      <button
        type="button"
        disabled={!hasProfile}
        onClick={() => navigate({ to: "/today" })}
        className="mt-6 min-h-14 w-full rounded-md bg-primary text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        Continue to today
      </button>
    </AppShell>
  );
}
