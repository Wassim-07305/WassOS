import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { getTasks } from "@/lib/data";
import { getFinances } from "@/lib/data";

export const metadata: Metadata = {
  title: "WassOS — Business Dashboard",
  description: "Application de gestion business tout-en-un",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tasks = getTasks();
  const finances = getFinances();

  const today = new Date().toISOString().split("T")[0];
  const overdueTasks = tasks.filter(
    (t) => t.status !== "terminé" && t.dueDate && t.dueDate < today
  ).length;

  const currentMonth = today.slice(0, 7);
  const monthlyRevenue = finances.revenue
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <html lang="fr">
      <body className="antialiased">
        <Sidebar overdueTasks={overdueTasks} monthlyRevenue={monthlyRevenue} />
        <CommandPalette />
        <main className="ml-60 min-h-screen">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
