"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  Target,
  FolderKanban,
  CheckSquare,
  Calendar,
  Wallet,
  BookOpen,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/leads", label: "Leads", icon: Target },
  { href: "/projects", label: "Projets", icon: FolderKanban },
  { href: "/tasks", label: "Tâches", icon: CheckSquare },
  { href: "/calendar", label: "Calendrier", icon: Calendar },
  { href: "/finances", label: "Finances", icon: Wallet },
  { href: "/daily", label: "Journal", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  overdueTasks: number;
  monthlyRevenue: number;
}

export function Sidebar({ overdueTasks, monthlyRevenue }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <Image src="/logo.png" alt="WassOS" width={32} height={32} className="rounded-lg" />
        <span className="text-lg font-bold tracking-tight">WassOS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.href === "/tasks" && overdueTasks > 0 && (
                <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">
                  {overdueTasks}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>CA ce mois</span>
          <span className="font-semibold text-foreground">
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(monthlyRevenue)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>WassOS v1.0</span>
          <span>{new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </div>
    </aside>
  );
}
