import { getProjects, getClients } from "@/lib/data";
import { ProjectsList } from "./projects-list";

export default function ProjectsPage() {
  const projects = getProjects();
  const clients = getClients();
  return <ProjectsList projects={projects} clients={clients} />;
}
