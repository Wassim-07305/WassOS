import { getTasks, getProjects, getLeads } from "@/lib/data";
import { CalendarView } from "./calendar-view";

export default function CalendarPage() {
  const tasks = getTasks();
  const projects = getProjects();
  const leads = getLeads();
  return <CalendarView tasks={tasks} projects={projects} leads={leads} />;
}
