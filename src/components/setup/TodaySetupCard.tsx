import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { getReferenceData, getTodaySetup, saveTodaySetup } from "@/lib/athlete.functions";

const LOCATIONS = ["home", "gym", "outdoor", "travel"] as const;
const SURFACES = ["hard", "soft", "mixed", "unknown"] as const;

type Location = (typeof LOCATIONS)[number];
type Surface = (typeof SURFACES)[number];

const chip = "min-h-11 rounded-md border px-3 text-sm transition-colors";

export function TodaySetupCard() {
  const queryClient = useQueryClient();
  const reference = useServerFn(getReferenceData);
  const todayFn = useServerFn(getTodaySetup);
  const save = useServerFn(saveTodaySetup);

  const referenceQuery = useQuery({ queryKey: ["reference-data"], queryFn: () => reference() });
  const todayQuery = useQuery({ queryKey: ["today-setup"], queryFn: () => todayFn() });

  const [location, setLocation] = useState<Location>("outdoor");
  const [surface, setSurface] = useState<Surface>("hard");
  const [minutes, setMinutes] = useState("70");
  const [equipmentIds, setEquipmentIds] = useState<string[]>([]);

  const today = todayQuery.data;
  useEffect(() => {
    if (!today?.context) return;
    setLocation(today.context.location as Location);
    setSurface(today.context.surface_type as Surface);
    setMinutes(String(today.context.available_minutes));
    setEquipmentIds(today.equipmentIds);
  }, [today]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          location,
          surface_type: surface,
          available_minutes: Number(minutes),
          equipment_ids: equipmentIds,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-setup"] });
      toast.success("Today's setup saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function toggleEquipment(id: string) {
    setEquipmentIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }

  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h2 className="label-caps">Today&rsquo;s setup</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Where you train today, the ground you have, and what equipment is actually available. Saved
        as today&rsquo;s training context — it does not create a workout.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="label-caps">Location</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {LOCATIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setLocation(e)}
                className={`${chip} ${
                  location === e
                    ? "border-primary bg-surface-raised text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="label-caps">Surface</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SURFACES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSurface(s)}
                className={`${chip} ${
                  surface === s
                    ? "border-primary bg-surface-raised text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="label-caps">Available minutes</span>
          <input
            className="metric mt-1 min-h-12 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus:border-ring"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </label>

        <div>
          <p className="label-caps">Equipment available today</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {referenceQuery.data?.equipment.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleEquipment(item.id)}
                className={`${chip} ${
                  equipmentIds.includes(item.id)
                    ? "border-primary bg-surface-raised text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="min-h-12 w-full rounded-md border border-border bg-surface-raised text-sm font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Save today's setup"}
        </button>
      </div>
    </section>
  );
}
