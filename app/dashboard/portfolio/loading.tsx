export default function PortfolioLoading() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="space-y-3">
            {/* Column header */}
            <div className="h-8 rounded-xl bg-zen-surface-2" />
            {/* Project cards */}
            {Array.from({ length: col === 0 ? 2 : col === 1 ? 3 : 1 }).map((_, j) => (
              <div key={j} className="h-28 rounded-2xl bg-zen-surface-2" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
