import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/weak-points")({
  head: () => ({
    meta: [
      { title: "Weak Points — Adaptive Calisthenics Training" },
      { name: "description", content: "Detected limiting qualities and coverage gaps in training." },
      { property: "og:title", content: "Weak Points — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Limiting qualities and training coverage gaps." },
    ],
  }),
  component: () => (
    <AppShell title="Weak Points">
      <PlaceholderPage
        heading="Weak Points"
        description="Limiting qualities detected from performance patterns, plus movement coverage gaps."
        items={["Detected limiters", "Coverage gaps", "Prescribed corrective work"]}
      />
    </AppShell>
  ),
});
