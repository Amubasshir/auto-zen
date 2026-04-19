type RingProps = {
  pct: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
};

export function Ring({ pct, size = 116, strokeWidth = 6, label, sublabel }: RingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(0.256 0.006 260)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="oklch(0.80 0.07 162)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {(label || sublabel) && (
        <div className="relative flex flex-col items-center gap-1 text-center">
          {label && (
            <span className="font-serif text-[28px] leading-none">{label}</span>
          )}
          {sublabel && (
            <span className="font-mono text-[10px] text-zen-text-4 tracking-[0.12em] uppercase">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
