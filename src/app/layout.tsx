import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { SidebarData } from "@/components/sidebar-data";
import { CommandPaletteLoader } from "@/components/command-palette-loader";

export const metadata: Metadata = {
  title: "WassOS — Business Dashboard",
  description: "Application de gestion business tout-en-un",
};

export const revalidate = 60;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Suspense fallback={<Sidebar overdueTasks={0} monthlyRevenue={0} />}>
          <SidebarData />
        </Suspense>
        <CommandPaletteLoader />
        <main className="ml-60 min-h-screen">
          <div className="p-8">{children}</div>
        </main>
      </body>
    </html>
  );
}
