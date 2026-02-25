import { getDailyLogs } from "@/lib/data";
import { DailyView } from "./daily-view";

export default function DailyPage() {
  const logs = getDailyLogs();
  return <DailyView logs={logs} />;
}
