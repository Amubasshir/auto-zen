import { fetchProjects } from "@/actions/projects";
import { PortfolioClient } from "@/components/portfolio/PortfolioClient";

export default async function PortfolioPage() {
  const projects = await fetchProjects();

  return <PortfolioClient initialProjects={projects} />;
}
