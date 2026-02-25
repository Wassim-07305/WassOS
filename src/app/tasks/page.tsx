import { getTasks, getProjects, getClients } from "@/lib/data";
import { TasksView } from "./tasks-view";

export default function TasksPage() {
  const tasks = getTasks();
  const projects = getProjects();
  const clients = getClients();
  return <TasksView tasks={tasks} projects={projects} clients={clients} />;
}
