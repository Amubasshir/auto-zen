import { render, screen, fireEvent } from "@testing-library/react";
import { ItemRow } from "@/components/month/ItemRow";
import type { Item } from "@/lib/mock-data";

const makeItem = (overrides: Partial<Item> = {}): Item => ({
  id: "item-1",
  title: "Understanding APIs",
  type: "course",
  completed: false,
  tasks: [
    { id: "t1", label: "Read docs", completed: true },
    { id: "t2", label: "Build example", completed: false },
  ],
  ...overrides,
});

describe("ItemRow", () => {
  it("renders the item title", () => {
    render(<ItemRow item={makeItem()} />);
    expect(screen.getByText("Understanding APIs")).toBeInTheDocument();
  });

  it("renders the type tag for course", () => {
    render(<ItemRow item={makeItem({ type: "course" })} />);
    expect(screen.getByText("Course")).toBeInTheDocument();
  });

  it("renders correct type labels for all types", () => {
    const types: Array<Item["type"]> = ["youtube", "docs", "article", "github"];
    const labels = ["YouTube", "Docs", "Article", "GitHub"];
    types.forEach((type, i) => {
      const { unmount } = render(<ItemRow item={makeItem({ type })} />);
      expect(screen.getByText(labels[i])).toBeInTheDocument();
      unmount();
    });
  });

  it("shows task count as done/total", () => {
    render(<ItemRow item={makeItem()} />);
    expect(screen.getByText("1/2 tasks")).toBeInTheDocument();
  });

  it("shows estimated duration (2 tasks × 15 min = 30m)", () => {
    render(<ItemRow item={makeItem()} />);
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("applies strikethrough styling when completed", () => {
    render(<ItemRow item={makeItem({ completed: true })} />);
    const title = screen.getByText("Understanding APIs");
    expect(title).toHaveClass("line-through");
  });

  it("calls onClick when row is clicked", () => {
    const onClick = jest.fn();
    render(<ItemRow item={makeItem()} onClick={onClick} />);
    fireEvent.click(screen.getByText("Understanding APIs"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("duration shows hours for large task counts", () => {
    const manyTasks = Array.from({ length: 5 }, (_, i) => ({
      id: `t${i}`,
      label: `Task ${i}`,
      completed: false,
    }));
    render(<ItemRow item={makeItem({ tasks: manyTasks })} />);
    // 5 tasks × 15 min = 75 min → ~1h
    expect(screen.getByText("1h")).toBeInTheDocument();
  });
});
