import { getLeads } from "@/lib/data";
import { LeadsPipeline } from "./leads-pipeline";

export default function LeadsPage() {
  const leads = getLeads();
  return <LeadsPipeline leads={leads} />;
}
