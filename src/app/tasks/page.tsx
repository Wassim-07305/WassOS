import { getTasks, getProjects, getClients } from "@/lib/data";
import { TasksView } from "./tasks-view";

export default async function TasksPage() {
  const [tasks, projects, clients] = await Promise.all([
    getTasks(),
    getProjects(),
    getClients(),
  ]);
  return <TasksView tasks={tasks} projects={projects} clients={clients} />;
}
