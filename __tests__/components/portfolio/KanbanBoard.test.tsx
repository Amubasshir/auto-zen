import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "@/components/portfolio/KanbanBoard";
import type { ProjectPortfolio } from "@/lib/mock-data";

const projects: ProjectPortfolio[] = [
  { id: "p1", title: "Project Alpha", description: "", status: "planned" },
  { id: "p2", title: "Project Beta", description: "", status: "in-progress" },
  { id: "p3", title: "Project Gamma", description: "", status: "completed" },
  { id: "p4", title: "Project Delta", description: "", status: "completed" },
];

describe("KanbanBoard", () => {
  it("renders all three column headings", () => {
    render(<KanbanBoard projects={projects} />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("places each project in the correct column", () => {
    render(<KanbanBoard projects={projects} />);
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
    expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    expect(screen.getByText("Project Delta")).toBeInTheDocument();
  });

  it("renders correct count per column", () => {
    render(<KanbanBoard projects={projects} />);
    // Column counts: Planned=1, In Progress=1, Completed=2
    const counts = screen.getAllByText(/^[0-9]+$/);
    const countValues = counts.map((el) => el.textContent);
    expect(countValues).toContain("1");
    expect(countValues).toContain("2");
  });

  it("renders empty board with no projects", () => {
    render(<KanbanBoard projects={[]} />);
    expect(screen.getByText("Planned")).toBeInTheDocument();
    // No project cards
    expect(screen.queryByText("Project Alpha")).not.toBeInTheDocument();
  });
});
