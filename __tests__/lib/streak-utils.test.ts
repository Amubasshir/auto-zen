import { buildActivityGrid, computeDaysSince } from "@/lib/streak-utils";

// ── buildActivityGrid ──────────────────────────────────────────────────────────

describe("buildActivityGrid", () => {
  it("returns exactly 28 cells", () => {
    expect(buildActivityGrid([])).toHaveLength(28);
  });

  it("all cells are 0 when no active days", () => {
    const grid = buildActivityGrid([]);
    expect(grid.every((v) => v === 0)).toBe(true);
  });

  it("marks today as level 4 when today is in activeDays", () => {
    const today = new Date().toISOString().slice(0, 10);
    const grid = buildActivityGrid([today]);
    expect(grid[27]).toBe(4); // last cell = today
  });

  it("marks yesterday as level 4", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = d.toISOString().slice(0, 10);
    const grid = buildActivityGrid([yesterday]);
    expect(grid[26]).toBe(4);
  });

  it("ignores dates outside the 28-day window", () => {
    const d = new Date();
    d.setDate(d.getDate() - 29);
    const old = d.toISOString().slice(0, 10);
    const grid = buildActivityGrid([old]);
    expect(grid.every((v) => v === 0)).toBe(true);
  });

  it("marks multiple active days correctly", () => {
    const days = [0, 5, 10].map((offset) => {
      const d = new Date();
      d.setDate(d.getDate() - offset);
      return d.toISOString().slice(0, 10);
    });
    const grid = buildActivityGrid(days);
    expect(grid[27]).toBe(4); // today
    expect(grid[22]).toBe(4); // 5 days ago
    expect(grid[17]).toBe(4); // 10 days ago
    expect(grid[0]).toBe(0);  // 27 days ago — not in list
  });
});

// ── computeDaysSince ──────────────────────────────────────────────────────────

describe("computeDaysSince", () => {
  it("returns 999 for empty string", () => {
    expect(computeDaysSince("")).toBe(999);
  });

  it("returns 0 for today", () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(computeDaysSince(today)).toBe(0);
  });

  it("returns 1 for yesterday", () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    expect(computeDaysSince(d.toISOString().slice(0, 10))).toBe(1);
  });

  it("returns 7 for a week ago", () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    expect(computeDaysSince(d.toISOString().slice(0, 10))).toBe(7);
  });
});
