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

  it("falls back to item.tasks for task count when doneTasks not provided", () => {
    render(<ItemRow item={makeItem()} />);
    expect(screen.getByText("1/2 tasks")).toBeInTheDocument();
  });

  it("uses explicit doneTasks prop when provided", () => {
    render(<ItemRow item={makeItem()} doneTasks={2} />);
    expect(screen.getByText("2/2 tasks")).toBeInTheDocument();
  });

  it("shows estimated duration (2 tasks × 15 min = 30m)", () => {
    render(<ItemRow item={makeItem()} />);
    expect(screen.getByText("30m")).toBeInTheDocument();
  });

  it("falls back to item.completed when isDone not provided", () => {
    render(<ItemRow item={makeItem({ completed: true })} />);
    expect(screen.getByText("Understanding APIs")).toHaveClass("line-through");
  });

  it("uses isDone prop over item.completed", () => {
    // item.completed = false, but isDone = true
    render(<ItemRow item={makeItem({ completed: false })} isDone={true} />);
    expect(screen.getByText("Understanding APIs")).toHaveClass("line-through");
  });

  it("isDone=false overrides item.completed=true", () => {
    render(<ItemRow item={makeItem({ completed: true })} isDone={false} />);
    expect(screen.getByText("Understanding APIs")).not.toHaveClass("line-through");
  });

  it("calls onClick when row body is clicked", () => {
    const onClick = jest.fn();
    render(<ItemRow item={makeItem()} onClick={onClick} />);
    fireEvent.click(screen.getByText("Understanding APIs"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle with !isDone when checkbox is clicked", () => {
    const onToggle = jest.fn();
    render(<ItemRow item={makeItem()} isDone={false} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText(/mark complete/i));
    expect(onToggle).toHaveBeenCalledWith(true);
  });

  it("calls onToggle with false when done checkbox is clicked", () => {
    const onToggle = jest.fn();
    render(<ItemRow item={makeItem()} isDone={true} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText(/mark incomplete/i));
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  it("checkbox click does NOT trigger onClick (row handler)", () => {
    const onClick = jest.fn();
    const onToggle = jest.fn();
    render(<ItemRow item={makeItem()} onClick={onClick} onToggle={onToggle} />);
    fireEvent.click(screen.getByLabelText(/mark complete/i));
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows hours for large task counts (5 tasks × 15 = 75min → 1h)", () => {
    const manyTasks = Array.from({ length: 5 }, (_, i) => ({
      id: `t${i}`,
      label: `Task ${i}`,
      completed: false,
    }));
    render(<ItemRow item={makeItem({ tasks: manyTasks })} />);
    expect(screen.getByText("1h")).toBeInTheDocument();
  });
});
