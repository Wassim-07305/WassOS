"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Task, Project, Lead } from "@/types";

interface CalendarEvent {
  date: string;
  title: string;
  type: "task" | "deadline" | "followup" | "maintenance";
  category?: string;
}

export function CalendarView({ tasks, projects, leads }: { tasks: Task[]; projects: Project[]; leads: Lead[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const events = useMemo(() => {
    const ev: CalendarEvent[] = [];

    tasks.forEach((t) => {
      if (t.dueDate && t.status !== "terminé") {
        ev.push({ date: t.dueDate, title: t.title, type: "task", category: t.category });
      }
    });

    projects.forEach((p) => {
      if (p.status === "en-cours" || p.status === "à-faire") {
        ev.push({ date: p.estimatedEndDate, title: `Deadline: ${p.name}`, type: "deadline" });
      }
      if (p.maintenanceStartDate) {
        ev.push({ date: p.maintenanceStartDate, title: `Début maintenance: ${p.name}`, type: "maintenance" });
      }
      if (p.maintenanceEndDate) {
        ev.push({ date: p.maintenanceEndDate, title: `Fin maintenance: ${p.name}`, type: "maintenance" });
      }
    });

    leads.forEach((l) => {
      if (l.nextFollowUpDate && l.status !== "gagné" && l.status !== "perdu") {
        ev.push({ date: l.nextFollowUpDate, title: `Follow-up: ${l.name}`, type: "followup" });
      }
    });

    return ev;
  }, [tasks, projects, leads]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const today = new Date().toISOString().split("T")[0];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Build week view
  const getWeekDays = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "task": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "deadline": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "followup": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "maintenance": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendrier</h1>
          <p className="text-muted-foreground text-sm mt-1">{events.length} événements à venir</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "month" ? "default" : "outline"} size="sm" onClick={() => setViewMode("month")}>Mois</Button>
          <Button variant={viewMode === "week" ? "default" : "outline"} size="sm" onClick={() => setViewMode("week")}>Semaine</Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">{monthName}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {viewMode === "month" ? (
        <Card>
          <CardContent className="p-4">
            {/* Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <div key={d} className="text-center text-xs text-muted-foreground py-2 font-medium">{d}</div>
              ))}
            </div>
            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const dayEvents = events.filter((e) => e.date === dateStr);
                const isToday = dateStr === today;

                return (
                  <div
                    key={day}
                    className={`h-24 rounded-lg p-1.5 border transition-colors ${
                      isToday ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/30"
                    }`}
                  >
                    <p className={`text-xs font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}>{day}</p>
                    <div className="space-y-0.5 overflow-hidden">
                      {dayEvents.slice(0, 3).map((ev, j) => (
                        <div
                          key={j}
                          className={`text-[9px] px-1 py-0.5 rounded truncate border ${typeColor(ev.type)}`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="text-[9px] text-muted-foreground px-1">+{dayEvents.length - 3} autres</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays().map((d) => {
                const dateStr = d.toISOString().split("T")[0];
                const dayEvents = events.filter((e) => e.date === dateStr);
                const isToday = dateStr === today;

                return (
                  <div key={dateStr} className="min-h-[300px]">
                    <div className={`text-center pb-3 border-b ${isToday ? "border-primary" : "border-border"}`}>
                      <p className="text-xs text-muted-foreground">{d.toLocaleDateString("fr-FR", { weekday: "short" })}</p>
                      <p className={`text-lg font-semibold ${isToday ? "text-primary" : ""}`}>{d.getDate()}</p>
                    </div>
                    <div className="space-y-1.5 mt-2">
                      {dayEvents.map((ev, j) => (
                        <div key={j} className={`text-[10px] px-2 py-1.5 rounded-lg border ${typeColor(ev.type)}`}>
                          {ev.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Tâches</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Deadlines</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Follow-ups</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Maintenance</span>
      </div>
    </div>
  );
}
