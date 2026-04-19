import { render, screen, fireEvent } from "@testing-library/react";
import { WeekCard } from "@/components/month/WeekCard";
import type { Week } from "@/lib/mock-data";

// Mocks needed by child components
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
    render(<WeekCard week={makeWeek()} weekIndex={1} />);
    expect(screen.getByText("Core Tools Setup")).toBeInTheDocument();
  });

  it("is collapsed by default (defaultOpen=false)", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={false} />);
    expect(screen.queryByText("Install Node")).not.toBeInTheDocument();
  });

  it("is expanded when defaultOpen=true", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} />);
    expect(screen.getByText("Install Node")).toBeInTheDocument();
  });

  it("expands on header click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={false} />);
    fireEvent.click(screen.getByText("Core Tools Setup"));
    expect(screen.getByText("Install Node")).toBeInTheDocument();
  });

  it("collapses again on second click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} />);
    fireEvent.click(screen.getByText("Core Tools Setup"));
    expect(screen.queryByText("Install Node")).not.toBeInTheDocument();
  });

  it("shows week number badge as W1", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} />);
    expect(screen.getByText("W1")).toBeInTheDocument();
  });

  it("shows Notes and Resource buttons when open", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} />);
    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("Resource")).toBeInTheDocument();
  });

  it("shows task fraction in header", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} />);
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("calls onItemClick when an item row is clicked", () => {
    const onItemClick = jest.fn();
    render(
      <WeekCard
        week={makeWeek()}
        weekIndex={1}
        defaultOpen={true}
        onItemClick={onItemClick}
      />,
    );
    fireEvent.click(screen.getByText("Install Node"));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });

  it("toggles inline notes panel on Notes button click", () => {
    render(<WeekCard week={makeWeek()} weekIndex={1} defaultOpen={true} />);
    expect(screen.queryByPlaceholderText(/write your notes/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Notes"));
    expect(screen.getByPlaceholderText(/write your notes/i)).toBeInTheDocument();
  });
});
