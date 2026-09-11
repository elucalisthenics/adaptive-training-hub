import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/_authenticated/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Adaptive Calisthenics Training" },
      { name: "description", content: "Skill trees and progression steps for calisthenics skills." },
      { property: "og:title", content: "Skills — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Skill progressions and current progression steps." },
    ],
  }),
  component: () => (
    <AppShell title="Skills">
      <PlaceholderPage
        heading="Skills"
        description="Tracked skills and their progression steps. Progression rules will live in the domain layer."
        items={["Muscle-up", "Front lever", "Handstand", "Planche"]}
      />
    </AppShell>
  ),
});
