"use client";

import {
  INCIDENT_TYPES,
  INCIDENT_TYPE_LABELS,
  URGENCIES,
  URGENCY_LABELS,
  type IncidentType,
  type Urgency,
} from "@/features/agent/agent.types";

const INCIDENT_ICONS: Record<IncidentType, string> = {
  suspected_recording: "📷",
  distribution_found: "🔍",
  distribution_threat: "✉",
  deepfake: "🧩",
  unsure: "❓",
};

const URGENCY_ICONS: Record<Urgency, string> = {
  immediate_danger: "⚠",
  not_immediate: "✓",
  unsure: "?",
};

function OptionGroup<T extends string>({
  legend,
  options,
  labels,
  icons,
  value,
  onChange,
  name,
}: {
  legend: string;
  options: T[];
  labels: Record<T, string>;
  icons: Record<T, string>;
  value: T | undefined;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-base font-semibold">{legend}</legend>
      <div className="grid gap-2">
        {options.map((opt) => {
          const id = `${name}-${opt}`;
          const selected = value === opt;
          return (
            <label
              key={opt}
              htmlFor={id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                selected ? "border-accent bg-accent-soft font-semibold" : "border-border bg-surface hover:bg-accent-soft/60"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
                className="h-4 w-4 accent-[var(--accent)]"
              />
              <span aria-hidden="true">{icons[opt]}</span>
              <span>{labels[opt]}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function UrgencySelector({ value, onChange }: { value?: Urgency; onChange: (u: Urgency) => void }) {
  return (
    <OptionGroup
      legend="지금 즉각적인 신체 위험이 있나요?"
      options={URGENCIES}
      labels={URGENCY_LABELS}
      icons={URGENCY_ICONS}
      value={value}
      onChange={onChange}
      name="urgency"
    />
  );
}

export function IncidentTypeSelector({
  value,
  onChange,
}: {
  value?: IncidentType;
  onChange: (t: IncidentType) => void;
}) {
  return (
    <OptionGroup
      legend="어떤 상황에 가장 가까운가요?"
      options={INCIDENT_TYPES}
      labels={INCIDENT_TYPE_LABELS}
      icons={INCIDENT_ICONS}
      value={value}
      onChange={onChange}
      name="incident"
    />
  );
}
