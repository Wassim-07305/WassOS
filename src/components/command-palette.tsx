"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  Plus,
  Search,
} from "lucide-react";

interface CommandItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const items: CommandItem[] = [
    { label: "Dashboard", icon: LayoutDashboard, action: () => router.push("/"), category: "Navigation" },
    { label: "Clients", icon: Users, action: () => router.push("/clients"), category: "Navigation" },
    { label: "Leads", icon: Target, action: () => router.push("/leads"), category: "Navigation" },
    { label: "Projets", icon: FolderKanban, action: () => router.push("/projects"), category: "Navigation" },
    { label: "Tâches", icon: CheckSquare, action: () => router.push("/tasks"), category: "Navigation" },
    { label: "Calendrier", icon: Calendar, action: () => router.push("/calendar"), category: "Navigation" },
    { label: "Finances", icon: Wallet, action: () => router.push("/finances"), category: "Navigation" },
    { label: "Journal", icon: BookOpen, action: () => router.push("/daily"), category: "Navigation" },
    { label: "Settings", icon: Settings, action: () => router.push("/settings"), category: "Navigation" },
    { label: "Nouveau client", icon: Plus, action: () => router.push("/clients?new=true"), category: "Actions" },
    { label: "Nouvelle tâche", icon: Plus, action: () => router.push("/tasks?new=true"), category: "Actions" },
    { label: "Nouveau lead", icon: Plus, action: () => router.push("/leads?new=true"), category: "Actions" },
    { label: "Nouveau projet", icon: Plus, action: () => router.push("/projects?new=true"), category: "Actions" },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setSearch("");
        setSelectedIndex(0);
      }
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filtered.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
      }
      if (e.key === "Enter" && filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setOpen(false);
      }
    },
    [open, filtered, selectedIndex]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden animate-fade-in">
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            autoFocus
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher..."
            className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Aucun résultat</p>
          )}
          {categories.map((cat) => (
            <div key={cat}>
              <p className="px-2 py-1.5 text-xs text-muted-foreground font-medium">{cat}</p>
              {filtered
                .filter((i) => i.category === cat)
                .map((item) => {
                  const globalIndex = filtered.indexOf(item);
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                        globalIndex === selectedIndex ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
