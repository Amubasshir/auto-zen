export function buildActivityGrid(activeDays: string[]): (0 | 4)[] {
  const activeSet = new Set(activeDays);
  const grid: (0 | 4)[] = [];
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    grid.push(activeSet.has(key) ? 4 : 0);
  }
  return grid;
}

export function computeDaysSince(lastDate: string): number {
  if (!lastDate) return 999;
  const last = new Date(lastDate);
  const today = new Date();
  const diffMs = today.setHours(0, 0, 0, 0) - last.setHours(0, 0, 0, 0);
  return Math.floor(diffMs / 86_400_000);
}
