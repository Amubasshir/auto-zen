export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zen-surface-2" />
        ))}
      </div>

      {/* Roadmap table skeleton */}
      <div className="rounded-2xl bg-zen-surface-2 overflow-hidden">
        <div className="h-10 bg-zen-surface-3 mb-px" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 border-b border-zen-line last:border-0" />
        ))}
      </div>

      {/* Today card */}
      <div className="h-40 rounded-2xl bg-zen-surface-2" />
    </div>
  );
}
