export default function TodayLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero */}
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="h-56 rounded-2xl bg-zen-surface-2" />
        <div className="h-56 rounded-2xl bg-zen-surface-2" />
      </div>

      {/* Pending grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-zen-surface-2" />
        ))}
      </div>
    </div>
  );
}
