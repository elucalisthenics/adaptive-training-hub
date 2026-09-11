import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

export const Route = createFileRoute("/_authenticated/program")({
  head: () => ({
    meta: [
      { title: "Program — Adaptive Calisthenics Training" },
      { name: "description", content: "Weekly training structure and planned session sequence." },
      { property: "og:title", content: "Program — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Weekly training structure and planned sessions." },
    ],
  }),
  component: () => (
    <AppShell title="Program">
      <PlaceholderPage
        heading="Program"
        description="Weekly structure, session sequencing and periodization. Generated later by the training engine."
        items={[
          "Weekly session split",
          "Volume and intensity distribution",
          "Deload and reset logic",
        ]}
      />
    </AppShell>
  ),
});
