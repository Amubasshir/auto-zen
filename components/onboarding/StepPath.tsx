"use client";

import { cn } from "@/lib/utils";

type PathType = "no-code" | "developer";

interface Props {
  value: PathType | null;
  onChange: (v: PathType) => void;
}

const OPTIONS: { value: PathType; label: string; desc: string; icon: string }[] = [
  {
    value: "no-code",
    label: "No-Code",
    desc: "Build powerful automations using visual tools — no coding required.",
    icon: "⚡",
  },
  {
    value: "developer",
    label: "Developer",
    desc: "Write scripts, APIs, and custom integrations with code.",
    icon: "🛠",
  },
];

export function StepPath({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase tracking-widest text-zen-muted font-mono">Step 1 of 4</p>
        <h2 className="text-2xl font-serif text-zen-text">Which path are you on?</h2>
        <p className="text-sm text-zen-muted">This shapes your roadmap and recommendations.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-5 text-left transition-all cursor-pointer",
              value === opt.value
                ? "border-zen-accent bg-zen-accent/10 shadow-[0_0_0_2px] shadow-zen-accent/40"
                : "border-zen-border bg-zen-surface hover:border-zen-muted/60",
            )}
          >
            <span className="text-2xl">{opt.icon}</span>
            <span className="font-semibold text-zen-text">{opt.label}</span>
            <span className="text-xs text-zen-muted leading-relaxed">{opt.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
