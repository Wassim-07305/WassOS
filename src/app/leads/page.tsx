import { getLeads } from "@/lib/data";
import { LeadsPipeline } from "./leads-pipeline";

export default async function LeadsPage() {
  const leads = await getLeads();
  return <LeadsPipeline leads={leads} />;
}
