import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import {
  getAthleteSetup,
  getReferenceData,
  saveEquipment,
  saveGoals,
  saveProfile,
} from "@/lib/athlete.functions";

const PRIORITIES = ["primary", "secondary", "maintenance"] as const;
const AVAILABILITY = ["always", "sometimes", "gym_only", "home_only"] as const;

type Priority = (typeof PRIORITIES)[number];
type Availability = (typeof AVAILABILITY)[number];

export function useSetupData() {
  const reference = useServerFn(getReferenceData);
  const setup = useServerFn(getAthleteSetup);
  const referenceQuery = useQuery({ queryKey: ["reference-data"], queryFn: () => reference() });
  const setupQuery = useQuery({ queryKey: ["athlete-setup"], queryFn: () => setup() });
  return { referenceQuery, setupQuery };
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-4">
      <h2 className="label-caps">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const fieldClass =
  "min-h-12 w-full rounded-md border border-input bg-background px-3 text-base outline-none focus:border-ring";
const buttonClass =
  "min-h-12 w-full rounded-md bg-primary px-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";

export function ProfileForm({ onSaved }: { onSaved?: () => void }) {
  const queryClient = useQueryClient();
  const { setupQuery } = useSetupData();
  const save = useServerFn(saveProfile);

  const [displayName, setDisplayName] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [minutes, setMinutes] = useState("70");

  const profile = setupQuery.data?.profile;
  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? "");
    setBodyweight(profile.bodyweight_kg != null ? String(profile.bodyweight_kg) : "");
    setMinutes(String(profile.default_session_minutes ?? 70));
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          display_name: displayName.trim(),
          bodyweight_kg: bodyweight ? Number(bodyweight) : null,
          default_session_minutes: Number(minutes),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-setup"] });
      toast.success("Profile saved");
      onSaved?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section title="Athlete profile" description="Name, bodyweight and default session length.">
      <div className="space-y-4">
        <label className="block">
          <span className="label-caps">Display name</span>
          <input
            className={`${fieldClass} mt-1`}
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Erik"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="label-caps">Bodyweight (kg)</span>
            <input
              className={`${fieldClass} metric mt-1`}
              inputMode="decimal"
              value={bodyweight}
              onChange={(e) => setBodyweight(e.target.value)}
              placeholder="78"
            />
          </label>
          <label className="block">
            <span className="label-caps">Session minutes</span>
            <input
              className={`${fieldClass} metric mt-1`}
              inputMode="numeric"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          className={buttonClass}
          disabled={mutation.isPending || displayName.trim().length === 0}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </Section>
  );
}

export function GoalsForm({ onSaved }: { onSaved?: () => void }) {
  const queryClient = useQueryClient();
  const { referenceQuery, setupQuery } = useSetupData();
  const save = useServerFn(saveGoals);

  const [selection, setSelection] = useState<Record<string, Priority | "none">>({});

  const goals = setupQuery.data?.goals;
  useEffect(() => {
    if (!goals) return;
    const next: Record<string, Priority | "none"> = {};
    for (const g of goals) next[g.skill_id] = g.priority as Priority;
    setSelection(next);
  }, [goals]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          goals: Object.entries(selection)
            .filter(([, p]) => p !== "none")
            .map(([skill_id, p]) => ({ skill_id, priority: p as Priority })),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-setup"] });
      toast.success("Goals saved");
      onSaved?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section title="Training goals" description="Set a priority per skill. Leave as none to ignore.">
      <div className="space-y-3">
        {referenceQuery.data?.skills.map((skill) => (
          <div key={skill.id} className="flex items-center justify-between gap-3">
            <span className="text-sm">{skill.name}</span>
            <select
              className="min-h-11 rounded-md border border-input bg-background px-2 text-sm"
              value={selection[skill.id] ?? "none"}
              onChange={(e) =>
                setSelection((s) => ({ ...s, [skill.id]: e.target.value as Priority | "none" }))
              }
            >
              <option value="none">none</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          className={buttonClass}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Save goals"}
        </button>
      </div>
    </Section>
  );
}

export function EquipmentForm({ onSaved }: { onSaved?: () => void }) {
  const queryClient = useQueryClient();
  const { referenceQuery, setupQuery } = useSetupData();
  const save = useServerFn(saveEquipment);

  const [selection, setSelection] = useState<Record<string, Availability | "none">>({});

  const equipment = setupQuery.data?.equipment;
  useEffect(() => {
    if (!equipment) return;
    const next: Record<string, Availability | "none"> = {};
    for (const e of equipment) next[e.equipment_id] = e.availability_type as Availability;
    setSelection(next);
  }, [equipment]);

  const mutation = useMutation({
    mutationFn: () =>
      save({
        data: {
          items: Object.entries(selection)
            .filter(([, a]) => a !== "none")
            .map(([equipment_id, a]) => ({
              equipment_id,
              availability_type: a as Availability,
            })),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athlete-setup"] });
      toast.success("Equipment saved");
      onSaved?.();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Section
      title="Usual equipment"
      description="What you normally have access to. Today's session can override this."
    >
      <div className="space-y-3">
        {referenceQuery.data?.equipment.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3">
            <span className="text-sm">{item.name}</span>
            <select
              className="min-h-11 rounded-md border border-input bg-background px-2 text-sm"
              value={selection[item.id] ?? "none"}
              onChange={(e) =>
                setSelection((s) => ({ ...s, [item.id]: e.target.value as Availability | "none" }))
              }
            >
              <option value="none">none</option>
              {AVAILABILITY.map((a) => (
                <option key={a} value={a}>
                  {a.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          className={buttonClass}
          disabled={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending ? "Saving…" : "Save equipment"}
        </button>
      </div>
    </Section>
  );
}
