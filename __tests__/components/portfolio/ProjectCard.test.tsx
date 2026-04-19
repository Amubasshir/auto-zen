import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import type { ProjectPortfolio } from "@/lib/mock-data";

const baseProject: ProjectPortfolio = {
  id: "proj-1",
  title: "Email Responder",
  description: "AI email triage system",
  status: "completed",
  githubUrl: "https://github.com/example/repo",
  demoUrl: "https://demo.example.com",
  completedAt: "2026-04-01",
};

describe("ProjectCard", () => {
  it("renders the project title", () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText("Email Responder")).toBeInTheDocument();
  });

  it("renders the project description", () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText("AI email triage system")).toBeInTheDocument();
  });

  it("renders GitHub link when provided", () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText("GitHub")).toBeInTheDocument();
    expect(screen.getByText("GitHub").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/example/repo",
    );
  });

  it("renders Demo link when provided", () => {
    render(<ProjectCard project={baseProject} />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("does not render links when URLs are absent", () => {
    render(
      <ProjectCard
        project={{ ...baseProject, githubUrl: undefined, demoUrl: undefined }}
      />,
    );
    expect(screen.queryByText("GitHub")).not.toBeInTheDocument();
    expect(screen.queryByText("Demo")).not.toBeInTheDocument();
  });

  it("renders formatted completion date", () => {
    render(<ProjectCard project={baseProject} />);
    // "2026-04-01" → "Apr 1, 2026"
    expect(screen.getByText(/Apr 1, 2026/)).toBeInTheDocument();
  });

  it("shows 'In progress' in footer when no completedAt", () => {
    render(
      <ProjectCard project={{ ...baseProject, completedAt: undefined }} />,
    );
    expect(screen.getByText("In progress")).toBeInTheDocument();
  });

  it("renders case study callout when provided", () => {
    render(
      <ProjectCard
        project={{ ...baseProject, caseStudy: "Reduced time by 70%" }}
      />,
    );
    expect(screen.getByText("Reduced time by 70%")).toBeInTheDocument();
  });
});
