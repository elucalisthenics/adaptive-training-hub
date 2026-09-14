import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { AppShell } from "@/components/layout/AppShell";
import { ExerciseCard } from "@/components/training/ExerciseCard";
import { TodaySetupCard } from "@/components/setup/TodaySetupCard";
import { mockTodayPlan } from "@/data/mock/today";
import { getTodaySetup } from "@/lib/athlete.functions";

export const Route = createFileRoute("/_authenticated/today")({
  head: () => ({
    meta: [
      { title: "Today — Adaptive Calisthenics Training" },
      {
        name: "description",
        content:
          "Today's calisthenics session: type, duration, focus skills and prescribed exercises.",
      },
      { property: "og:title", content: "Today — Adaptive Calisthenics Training" },
      {
        property: "og:description",
        content: "Today's session type, duration, focus skills and prescribed exercises.",
      },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const plan = mockTodayPlan;
  const sessionLabel = plan.sessionType.replace("_", " ");
  const todayFn = useServerFn(getTodaySetup);
  const todayQuery = useQuery({ queryKey: ["today-setup"], queryFn: () => todayFn() });
  const ctx = todayQuery.data?.context;

  return (
    <AppShell title="Today">
      <section className="rounded-lg border border-border bg-surface p-5">
        <p className="label-caps">Session</p>
        <h1 className="mt-1 text-4xl font-semibold uppercase tracking-wide">{sessionLabel}</h1>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div>
            <p className="label-caps">Available</p>
            <p className="metric mt-1 text-2xl">
              {ctx ? `${ctx.available_minutes} min` : `${plan.estimatedMinutes} min`}
            </p>
          </div>
          <div>
            <p className="label-caps">Location</p>
            <p className="metric mt-1 text-2xl">{ctx ? ctx.location : plan.environment}</p>
          </div>
          <div>
            <p className="label-caps">Surface</p>
            <p className="metric mt-1 text-2xl">{ctx ? ctx.surface_type : "not set"}</p>
          </div>
          <div>
            <p className="label-caps">Equipment today</p>
            <p className="metric mt-1 text-2xl">{todayQuery.data?.equipmentIds.length ?? 0}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="label-caps">Focus</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {plan.focus.map((f) => (
              <li
                key={f}
                className="rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6">
        <TodaySetupCard />
      </div>

      <div className="mt-6 space-y-6">
        {plan.blocks.map((block) => (
          <section key={block.id}>
            <h2 className="label-caps">{block.title}</h2>
            <div className="mt-2 space-y-2">
              {block.exercises.map((exercise) => (
                <ExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="sticky bottom-20 mt-8 md:bottom-4">
        <button
          type="button"
          disabled
          className="min-h-14 w-full rounded-lg bg-primary text-base font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity disabled:opacity-50"
        >
          Start Workout
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Mock session — the training engine is not implemented yet.
        </p>
      </div>
    </AppShell>
  );
}
