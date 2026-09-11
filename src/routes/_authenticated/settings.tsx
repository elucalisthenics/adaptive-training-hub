import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { checkBackendConnection } from "@/data/backend-health";

export const Route = createFileRoute("/_authenticated/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Adaptive Calisthenics Training" },
      { name: "description", content: "Training preferences, equipment, environment and backend status." },
      { property: "og:title", content: "Settings — Adaptive Calisthenics Training" },
      { property: "og:description", content: "Preferences, equipment, environment and backend status." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data, isPending } = useQuery({
    queryKey: ["backend-health"],
    queryFn: checkBackendConnection,
  });

  return (
    <AppShell title="Settings">
      <h1 className="text-3xl font-semibold uppercase tracking-wide">Settings</h1>
      <p className="mt-2 max-w-prose text-sm text-muted-foreground">
        Preferences that will feed the training engine: equipment, environment, session length caps
        and recovery inputs. Not editable yet.
      </p>

      <ul className="mt-6 space-y-2">
        {["Equipment available", "Default environment", "Session length cap", "Recovery inputs"].map(
          (item) => (
            <li
              key={item}
              className="rounded-lg border border-dashed border-border bg-card px-4 py-4 text-sm text-muted-foreground"
            >
              {item}
            </li>
          ),
        )}
      </ul>

      <section className="mt-8 rounded-lg border border-border bg-surface p-4">
        <p className="label-caps">Backend</p>
        <p className="mt-2 text-sm">
          {isPending ? "Checking connection…" : data?.ok ? "Connected and reachable" : `Unreachable: ${data?.message}`}
        </p>
      </section>
    </AppShell>
  );
}
