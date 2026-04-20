"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

export function StepHours({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase tracking-widest text-zen-muted font-mono">Step 2 of 4</p>
        <h2 className="text-2xl font-serif text-zen-text">How many hours per week?</h2>
        <p className="text-sm text-zen-muted">We'll use this to pace your roadmap.</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <span className="text-6xl font-semibold text-zen-accent tabular-nums">{value}</span>
        <span className="text-sm text-zen-muted">hours / week</span>

        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[var(--color-zen-accent)] cursor-pointer"
          aria-label="Weekly hours"
        />

        <div className="flex justify-between w-full text-xs text-zen-muted font-mono">
          <span>1h</span>
          <span>40h</span>
        </div>
      </div>
    </div>
  );
}
