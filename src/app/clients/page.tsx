import { getClients, getProjects, getFinances } from "@/lib/data";
import { ClientsList } from "./clients-list";

export default function ClientsPage() {
  const clients = getClients();
  const projects = getProjects();
  const finances = getFinances();

  const clientsWithData = clients.map((client) => {
    const clientProjects = projects.filter((p) => p.clientId === client.id);
    const totalRevenue = finances.revenue
      .filter((r) => clientProjects.some((p) => p.id === r.projectId))
      .reduce((sum, r) => sum + r.amount, 0);
    const activeProjectCount = clientProjects.filter((p) => p.status === "en-cours").length;

    return {
      ...client,
      projectCount: clientProjects.length,
      activeProjectCount,
      totalRevenue,
      projects: clientProjects,
    };
  });

  return <ClientsList clients={clientsWithData} />;
}
