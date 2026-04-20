"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function StepStart({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase tracking-widest text-zen-muted font-mono">Step 4 of 4</p>
        <h2 className="text-2xl font-serif text-zen-text">When did you start?</h2>
        <p className="text-sm text-zen-muted">
          Your start date anchors your roadmap timeline.
        </p>
      </div>

      <input
        type="date"
        value={value}
        max={new Date().toISOString().slice(0, 10)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zen-border bg-zen-surface px-4 py-3 text-zen-text text-sm focus:outline-none focus:border-zen-accent cursor-pointer"
        aria-label="Start date"
      />

      <p className="text-xs text-zen-muted">
        You can always change this later in your settings.
      </p>
    </div>
  );
}
