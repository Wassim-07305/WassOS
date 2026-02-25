import { getFinances, getProjects } from "@/lib/data";
import { FinancesView } from "./finances-view";

export default async function FinancesPage() {
  const [finances, projects] = await Promise.all([
    getFinances(),
    getProjects(),
  ]);
  return <FinancesView finances={finances} projects={projects} />;
}
