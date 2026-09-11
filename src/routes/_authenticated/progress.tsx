import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Adaptive Calisthenics Training" },
      { name: "description", content: "Workout history, volume trends and performance progression." },
      { property: "og:title", content: "Progress — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Workout history and performance trends over time." },
    ],
  }),
  component: () => (
    <AppShell title="Progress">
      <PlaceholderPage
        heading="Progress"
        description="Workout history, volume and performance trends. Data comes from the backend once logging exists."
        items={["Session history", "Volume per movement pattern", "Skill hold and rep trends"]}
      />
    </AppShell>
  ),
});
