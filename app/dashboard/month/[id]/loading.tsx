export default function MonthLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Month header */}
      <div className="h-36 rounded-2xl bg-zen-surface-2" />

      {/* Week cards */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-zen-surface-2 overflow-hidden">
          <div className="h-12 bg-zen-surface-3" />
          {i === 0 &&
            Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-11 border-b border-zen-line last:border-0 mx-4" />
            ))}
        </div>
      ))}
    </div>
  );
}
