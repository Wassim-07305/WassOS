import { getDailyLogs } from "@/lib/data";
import { DailyView } from "./daily-view";

export default async function DailyPage() {
  const logs = await getDailyLogs();
  return <DailyView logs={logs} />;
}
