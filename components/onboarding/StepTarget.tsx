"use client";

interface Props {
  value: number;
  onChange: (v: number) => void;
}

const PRESETS = [3, 5, 7, 10];

export function StepTarget({ value, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase tracking-widest text-zen-muted font-mono">Step 3 of 4</p>
        <h2 className="text-2xl font-serif text-zen-text">Weekly learning target</h2>
        <p className="text-sm text-zen-muted">How many items do you aim to complete each week?</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`
              rounded-xl border py-4 text-lg font-semibold transition-all cursor-pointer
              ${value === preset
                ? "border-jade bg-jade/10 text-jade shadow-[0_0_0_2px] shadow-jade/40"
                : "border-zen-border bg-zen-surface text-zen-text hover:border-zen-muted/60"
              }
            `}
          >
            {preset}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-zen-muted shrink-0">Custom:</label>
        <input
          type="number"
          min={1}
          max={20}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (n >= 1 && n <= 20) onChange(n);
          }}
          className="w-20 rounded-lg border border-zen-border bg-zen-surface px-3 py-2 text-center text-zen-text text-sm focus:outline-none focus:border-jade"
          aria-label="Custom weekly target"
        />
        <span className="text-sm text-zen-muted">items / week</span>
      </div>
    </div>
  );
}
