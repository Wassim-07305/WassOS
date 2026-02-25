import { getTasks, getFinances } from "@/lib/data";
import { Sidebar } from "./sidebar";

export async function SidebarData() {
  const [tasks, finances] = await Promise.all([getTasks(), getFinances()]);

  const today = new Date().toISOString().split("T")[0];
  const overdueTasks = tasks.filter(
    (t) => t.status !== "terminé" && t.dueDate && t.dueDate < today
  ).length;

  const currentMonth = today.slice(0, 7);
  const monthlyRevenue = finances.revenue
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.amount, 0);

  return <Sidebar overdueTasks={overdueTasks} monthlyRevenue={monthlyRevenue} />;
}
