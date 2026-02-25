import { getConfig } from "@/lib/data";
import { SettingsView } from "./settings-view";

export default async function SettingsPage() {
  const config = await getConfig();
  return <SettingsView config={config} />;
}
