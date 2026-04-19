import { render, screen } from "@testing-library/react";
import { PendingGrid } from "@/components/today/PendingGrid";
import type { Month } from "@/lib/mock-data";

jest.mock("next/link", () => {
  return function MockLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
    return <a href={href} className={className}>{children}</a>;
  };
});

const makeMonth = (overrides: Partial<Month> = {}): Month => ({
  id: "month-1",
  monthNumber: 1,
  title: "Test Month",
  goal: "Test goal",
  milestone: "Test milestone",
  color: "#fff",
  weeks: [
    {
      id: "week-1",
      weekNumber: 1,
      title: "Week One",
      items: [
        {
          id: "item-1",
          title: "Incomplete Item",
          type: "course",
          completed: false,
          tasks: [{ id: "t1", label: "Task 1", completed: false }],
        },
      ],
    },
  ],
  ...overrides,
});

describe("PendingGrid", () => {
  it("renders pending items", () => {
    render(<PendingGrid months={[makeMonth()]} />);
    expect(screen.getByText("Incomplete Item")).toBeInTheDocument();
  });

  it("shows empty state when all items complete", () => {
    const month = makeMonth();
    month.weeks[0].items[0].completed = true;
    render(<PendingGrid months={[month]} />);
    expect(screen.getByText(/all caught up/i)).toBeInTheDocument();
  });

  it("caps displayed items at 6", () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Item ${i}`,
      type: "course" as const,
      completed: false,
      tasks: [],
    }));
    const month = makeMonth();
    month.weeks[0].items = items;
    render(<PendingGrid months={[month]} />);
    // Only 6 item titles should appear
    const links = screen.getAllByRole("link");
    expect(links.length).toBeLessThanOrEqual(6);
  });

  it("shows item count in header", () => {
    render(<PendingGrid months={[makeMonth()]} />);
    expect(screen.getByText("1 items")).toBeInTheDocument();
  });

  it("links each card to the month detail page", () => {
    render(<PendingGrid months={[makeMonth()]} />);
    const link = screen.getByText("Incomplete Item").closest("a");
    expect(link).toHaveAttribute("href", "/dashboard/month/month-1");
  });
});
