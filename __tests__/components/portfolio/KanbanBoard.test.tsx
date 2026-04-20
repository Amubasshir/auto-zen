import { render, screen } from "@testing-library/react";
import { KanbanBoard } from "@/components/portfolio/KanbanBoard";
import type { ClientProject } from "@/lib/validators/project";

const noop = jest.fn();

const makeProject = (
  overrides: Partial<ClientProject> & Pick<ClientProject, "id" | "title" | "status">,
): ClientProject => ({
  description: "",
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const projects: ClientProject[] = [
  makeProject({ id: "p1", title: "Project Alpha", status: "planned" }),
  makeProject({ id: "p2", title: "Project Beta", status: "in-progress" }),
  makeProject({ id: "p3", title: "Project Gamma", status: "completed" }),
  makeProject({ id: "p4", title: "Project Delta", status: "completed" }),
];

describe("KanbanBoard", () => {
  it("renders all three column headings", () => {
    render(
      <KanbanBoard
        projects={projects}
        draggedId={null}
        onDragStart={noop}
        onDrop={noop}
        onEdit={noop}
        onDelete={noop}
        onAddClick={noop}
      />,
    );
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("places each project in the correct column", () => {
    render(
      <KanbanBoard
        projects={projects}
        draggedId={null}
        onDragStart={noop}
        onDrop={noop}
        onEdit={noop}
        onDelete={noop}
        onAddClick={noop}
      />,
    );
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Project Beta")).toBeInTheDocument();
    expect(screen.getByText("Project Gamma")).toBeInTheDocument();
    expect(screen.getByText("Project Delta")).toBeInTheDocument();
  });

  it("renders correct count per column", () => {
    render(
      <KanbanBoard
        projects={projects}
        draggedId={null}
        onDragStart={noop}
        onDrop={noop}
        onEdit={noop}
        onDelete={noop}
        onAddClick={noop}
      />,
    );
    const counts = screen.getAllByText(/^[0-9]+$/);
    const countValues = counts.map((el) => el.textContent);
    expect(countValues).toContain("1");
    expect(countValues).toContain("2");
  });

  it("renders empty board with no projects", () => {
    render(
      <KanbanBoard
        projects={[]}
        draggedId={null}
        onDragStart={noop}
        onDrop={noop}
        onEdit={noop}
        onDelete={noop}
        onAddClick={noop}
      />,
    );
    expect(screen.getByText("Planned")).toBeInTheDocument();
    expect(screen.queryByText("Project Alpha")).not.toBeInTheDocument();
  });

  it("shows Add project button only in Planned column", () => {
    render(
      <KanbanBoard
        projects={[]}
        draggedId={null}
        onDragStart={noop}
        onDrop={noop}
        onEdit={noop}
        onDelete={noop}
        onAddClick={noop}
      />,
    );
    const addButtons = screen.getAllByText("Add project");
    expect(addButtons).toHaveLength(1);
  });
});
