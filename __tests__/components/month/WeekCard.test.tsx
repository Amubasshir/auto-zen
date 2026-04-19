import { render, screen, fireEvent } from "@testing-library/react";
import { WeekCard } from "@/components/month/WeekCard";
import type { Week } from "@/lib/mock-data";
import { EMPTY_PROGRESS } from "@/lib/validators/progress";

jest.mock("next/link", () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>;
  };
});

const makeWeek = (): Week => ({
  id: "week-1",
  weekNumber: 1,
  title: "Core Tools Setup",
  items: [
    {
      id: "item-1",
      title: "Install Node",
      type: "docs",
      completed: false,
      tasks: [
        { id: "t1", label: "Install", completed: true },
        { id: "t2", label: "Configure", completed: false },
      ],
    },
  ],
});

describe("WeekCard", () => {
  it("renders the week title", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} progress={EMPTY_PROGRESS} />);
    expect(screen.getByText("Core Tools Setup")).toBeInTheDocument();
  });

  it("is collapsed by default (defaultOpen=false)", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={false} progress={EMPTY_PROGRESS} />);
    expect(screen.queryByText("Install Node")).not.toBeInTheDocument();
  });

  it("is expanded when defaultOpen=true", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} progress={EMPTY_PROGRESS} />);
    expect(screen.getByText("Install Node")).toBeInTheDocument();
  });

  it("expands on header click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={false} progress={EMPTY_PROGRESS} />);
    fireEvent.click(screen.getByText("Core Tools Setup"));
    expect(screen.getByText("Install Node")).toBeInTheDocument();
  });

  it("collapses again on second click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} progress={EMPTY_PROGRESS} />);
    fireEvent.click(screen.getByText("Core Tools Setup"));
    expect(screen.queryByText("Install Node")).not.toBeInTheDocument();
  });

  it("shows week number badge as W1", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} progress={EMPTY_PROGRESS} />);
    expect(screen.getByText("W1")).toBeInTheDocument();
  });

  it("shows Notes and Resource buttons when open", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} progress={EMPTY_PROGRESS} />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Resource")).toBeInTheDocument();
  });

  it("shows task fraction from mock data when progress is empty", () => {
    // 1 task completed out of 2 (from mock)
    render(<WeekCard week={makeWeek()} weekIndex={1} progress={EMPTY_PROGRESS} />);
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("shows task fraction from real progress when provided", () => {
    const progress = {
      completedItems: {},
      completedTasks: { "item-1": { t1: true, t2: true } },
    };
    render(<WeekCard week={makeWeek()} weekIndex={1} progress={progress} />);
    expect(screen.getByText("2/2")).toBeInTheDocument();
  });

  it("calls onItemClick when an item row body is clicked", () => {
    const onItemClick = jest.fn();
    render(
      <WeekCard
        week={makeWeek()}
        weekIndex={1}
        defaultOpen={true}
        progress={EMPTY_PROGRESS}
        onItemClick={onItemClick}
      />,
    );
    fireEvent.click(screen.getByText("Install Node"));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it("calls onItemToggle when checkbox is clicked", () => {
    const onItemToggle = jest.fn();
    render(
      <WeekCard
        week={makeWeek()}
        weekIndex={1}
        defaultOpen={true}
        progress={EMPTY_PROGRESS}
        onItemToggle={onItemToggle}
      />,
    );
    fireEvent.click(screen.getByLabelText(/mark complete/i));
    expect(onItemToggle).toHaveBeenCalledWith("item-1", true);
  });

  it("toggles inline notes panel on Notes button click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} progress={EMPTY_PROGRESS} />);
    expect(screen.queryByPlaceholderText(/write your notes/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Notes"));
    expect(screen.getByPlaceholderText(/write your notes/i)).toBeInTheDocument();
  });
});
