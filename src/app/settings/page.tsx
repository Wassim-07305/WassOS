import { getConfig } from "@/lib/data";
import { SettingsView } from "./settings-view";

export default function SettingsPage() {
  const config = getConfig();
  return <SettingsView config={config} />;
}
