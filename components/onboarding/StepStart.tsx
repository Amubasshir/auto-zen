"use client";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (v: string) => void;
}

export function StepStart({ value, onChange }: Props) {
  const [yyyy, mm, dd] = value.split("-");
  const year = parseInt(yyyy, 10);
  const month = parseInt(mm, 10); // 1-based
  const day = parseInt(dd, 10);

  function update(nextYear: number, nextMonth: number, nextDay: number) {
    const y = String(nextYear).padStart(4, "0");
    const m = String(nextMonth).padStart(2, "0");
    const d = String(nextDay).padStart(2, "0");
    onChange(`${y}-${m}-${d}`);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const clampedDay = Math.min(day, daysInMonth);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="space-y-6">
      <div className="space-y-1 mb-6">
        <p className="text-xs uppercase tracking-widest text-zen-muted font-mono">Step 4 of 4</p>
        <h2 className="text-2xl font-serif text-zen-text">When did you start?</h2>
        <p className="text-sm text-zen-muted">
          Your start date anchors your roadmap timeline.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Day */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-zen-muted font-mono">Day</label>
          <select
            value={clampedDay}
            onChange={(e) => update(year, month, parseInt(e.target.value, 10))}
            className="rounded-xl border border-zen-border bg-zen-surface px-3 py-3 text-zen-text text-sm focus:outline-none focus:border-zen-accent cursor-pointer"
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{String(d).padStart(2, "0")}</option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-zen-muted font-mono">Month</label>
          <select
            value={month}
            onChange={(e) => update(year, parseInt(e.target.value, 10), clampedDay)}
            className="rounded-xl border border-zen-border bg-zen-surface px-3 py-3 text-zen-text text-sm focus:outline-none focus:border-zen-accent cursor-pointer"
          >
            {MONTHS.map((name, i) => (
              <option key={name} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] uppercase tracking-widest text-zen-muted font-mono">Year</label>
          <select
            value={year}
            onChange={(e) => update(parseInt(e.target.value, 10), month, clampedDay)}
            className="rounded-xl border border-zen-border bg-zen-surface px-3 py-3 text-zen-text text-sm focus:outline-none focus:border-zen-accent cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-zen-muted">
        You can always change this later in your settings.
      </p>
    </div>
  );
}
