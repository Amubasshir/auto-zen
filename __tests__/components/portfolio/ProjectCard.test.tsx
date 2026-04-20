import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import type { ClientProject } from "@/lib/validators/project";

const baseProject: ClientProject = {
  id: "proj-1",
  title: "Email Responder",
  description: "AI email triage system",
  status: "completed",
  githubUrl: "https://github.com/example/repo",
  demoUrl: "https://demo.example.com",
  completedAt: "2026-04-01T00:00:00.000Z",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const noop = jest.fn();

describe("ProjectCard", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the project title", () => {
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText("Email Responder")).toBeInTheDocument();
  });

  it("renders the project description", () => {
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText("AI email triage system")).toBeInTheDocument();
  });

  it("renders GitHub link when provided", () => {
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("GitHub").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/example/repo",
    );
  });

  it("renders Demo link when provided", () => {
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("does not render links when URLs are absent", () => {
    render(
      <ProjectCard
        project={{ ...baseProject, githubUrl: undefined, demoUrl: undefined }}
        onStatusChange={noop}
        onEdit={noop}
        onDelete={noop}
      />,
    );
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("Demo")).not.toBeInTheDocument();
  });

  it("renders formatted completion date", () => {
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={noop} />);
    expect(screen.getByText(/Apr 1, 2026/)).toBeInTheDocument();
  });

  it("shows 'In progress' in footer when no completedAt", () => {
    render(
      <ProjectCard project={{ ...baseProject, completedAt: undefined }} onStatusChange={noop} onEdit={noop} onDelete={noop} />,
    );
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("renders case study callout when provided", () => {
    render(
      <ProjectCard
        project={{ ...baseProject, caseStudy: "Reduced time by 70%" }}
        onStatusChange={noop}
        onEdit={noop}
        onDelete={noop}
      />,
    );
    expect(screen.getByText("Reduced time by 70%")).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const onEdit = jest.fn();
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={onEdit} onDelete={noop} />);
    fireEvent.click(screen.getByLabelText("Edit project"));
    expect(onEdit).toHaveBeenCalledWith(baseProject);
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = jest.fn();
    render(<ProjectCard project={baseProject} onStatusChange={noop} onEdit={noop} onDelete={onDelete} />);
    fireEvent.click(screen.getByLabelText("Delete project"));
    expect(onDelete).toHaveBeenCalledWith("proj-1");
  });

  it("calls onStatusChange when advance status button is clicked", () => {
    const onStatusChange = jest.fn();
    render(<ProjectCard project={baseProject} onStatusChange={onStatusChange} onEdit={noop} onDelete={noop} />);
    fireEvent.click(screen.getByLabelText("Advance status"));
    expect(onStatusChange).toHaveBeenCalledWith("proj-1");
  });
});
