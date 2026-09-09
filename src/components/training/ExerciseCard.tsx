import type { ExercisePrescription } from "@/types/training";

function formatRest(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ExerciseCard({ exercise }: { exercise: ExercisePrescription }) {
  const volume =
    exercise.unit === "reps"
      ? `${exercise.sets} × ${exercise.reps}`
      : `${exercise.sets} × ${exercise.reps}s`;

  return (
    <article className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-semibold">{exercise.name}</h3>
        <span className="metric text-lg text-data">{volume}</span>
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
        {exercise.rir !== undefined && (
          <div className="flex items-baseline gap-2">
            <dt className="label-caps">RIR</dt>
            <dd className="metric text-sm">{exercise.rir}</dd>
          </div>
        )}
        <div className="flex items-baseline gap-2">
          <dt className="label-caps">Rest</dt>
          <dd className="metric text-sm">{formatRest(exercise.restSeconds)}</dd>
        </div>
      </dl>
      {exercise.note && (
        <p className="mt-2 text-sm text-muted-foreground">{exercise.note}</p>
      )}
    </article>
  );
}
