import { getProjects, getClients } from "@/lib/data";
import { ProjectsList } from "./projects-list";

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([
    getProjects(),
    getClients(),
  ]);
  return <ProjectsList projects={projects} clients={clients} />;
}
