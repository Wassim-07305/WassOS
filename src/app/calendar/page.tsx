import { getTasks, getProjects, getLeads } from "@/lib/data";
import { CalendarView } from "./calendar-view";

export default async function CalendarPage() {
  const [tasks, projects, leads] = await Promise.all([
    getTasks(),
    getProjects(),
    getLeads(),
  ]);
  return <CalendarView tasks={tasks} projects={projects} leads={leads} />;
}
