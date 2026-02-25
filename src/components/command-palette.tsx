"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  href: string;
  category: string;
}

const items: CommandItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", category: "Navigation" },
  { label: "Clients", icon: Users, href: "/clients", category: "Navigation" },
  { label: "Leads", icon: Target, href: "/leads", category: "Navigation" },
  { label: "Projets", icon: FolderKanban, href: "/projects", category: "Navigation" },
  { label: "Tâches", icon: CheckSquare, href: "/tasks", category: "Navigation" },
  { label: "Calendrier", icon: Calendar, href: "/calendar", category: "Navigation" },
  { label: "Finances", icon: Wallet, href: "/finances", category: "Navigation" },
  { label: "Journal", icon: BookOpen, href: "/daily", category: "Navigation" },
  { label: "Settings", icon: Settings, href: "/settings", category: "Navigation" },
  { label: "Nouveau client", icon: Plus, href: "/clients?new=true", category: "Actions" },
  { label: "Nouvelle tâche", icon: Plus, href: "/tasks?new=true", category: "Actions" },
  { label: "Nouveau lead", icon: Plus, href: "/leads?new=true", category: "Actions" },
  { label: "Nouveau projet", icon: Plus, href: "/projects?new=true", category: "Actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const selectedRef = useRef(selectedIndex);
  const searchRef = useRef(search);

  selectedRef.current = selectedIndex;
  searchRef.current = search;

  const filtered = useMemo(
    () => items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
    [search]
  );
  const filteredRef = useRef(filtered);
  filteredRef.current = filtered;

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      setOpen(false);
    },
    [router]
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setSearch("");
        setSelectedIndex(0);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      const f = filteredRef.current;
      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % f.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + f.length) % f.length);
      } else if (e.key === "Enter") {
        const item = f[selectedRef.current];
        if (item) navigate(item.href);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, navigate]);

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
                      onClick={() => navigate(item.href)}
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
