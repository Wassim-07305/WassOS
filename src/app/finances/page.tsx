import { getFinances, getProjects } from "@/lib/data";
import { FinancesView } from "./finances-view";

export default function FinancesPage() {
  const finances = getFinances();
  const projects = getProjects();
  return <FinancesView finances={finances} projects={projects} />;
}
