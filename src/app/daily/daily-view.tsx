"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sun,
  Moon,
  Bot,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Smile,
  Lightbulb,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { saveDailyLog } from "@/app/actions";
import type { DailyLog } from "@/types";

export function DailyView({ logs }: { logs: DailyLog[] }) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const existingLog = logs.find((l) => l.date === selectedDate);

  const [morningPlan, setMorningPlan] = useState<string[]>(existingLog?.morningPlan || []);
  const [newPlanItem, setNewPlanItem] = useState("");

  const [completed, setCompleted] = useState<string[]>(existingLog?.eveningReview?.completed || []);
  const [notCompleted, setNotCompleted] = useState<string[]>(existingLog?.eveningReview?.notCompleted || []);
  const [blockers, setBlockers] = useState(existingLog?.eveningReview?.blockers || "");
  const [mood, setMood] = useState(existingLog?.eveningReview?.mood || 7);
  const [lessonsLearned, setLessonsLearned] = useState(existingLog?.eveningReview?.lessonsLearned || "");

  const loadDate = (date: string) => {
    setSelectedDate(date);
    const log = logs.find((l) => l.date === date);
    setMorningPlan(log?.morningPlan || []);
    setCompleted(log?.eveningReview?.completed || []);
    setNotCompleted(log?.eveningReview?.notCompleted || []);
    setBlockers(log?.eveningReview?.blockers || "");
    setMood(log?.eveningReview?.mood || 7);
    setLessonsLearned(log?.eveningReview?.lessonsLearned || "");
    setNewPlanItem("");
  };

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    loadDate(d.toISOString().split("T")[0]);
  };

  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    loadDate(d.toISOString().split("T")[0]);
  };

  const addPlanItem = () => {
    if (newPlanItem.trim()) {
      setMorningPlan([...morningPlan, newPlanItem.trim()]);
      setNewPlanItem("");
    }
  };

  const removePlanItem = (index: number) => {
    setMorningPlan(morningPlan.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const log: DailyLog = {
      date: selectedDate,
      morningPlan,
      eveningReview: completed.length > 0 || notCompleted.length > 0 || blockers || lessonsLearned
        ? { completed, notCompleted, blockers, mood, lessonsLearned }
        : null,
      coworkInsights: existingLog?.coworkInsights || null,
    };
    await saveDailyLog(log);
  };

  const isToday = selectedDate === today;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal quotidien</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date(selectedDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevDay}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {!isToday && (
            <Button variant="outline" size="sm" onClick={() => loadDate(today)}>
              Aujourd&apos;hui
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Morning Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              Plan du matin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {morningPlan.map((item, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                <p className="text-sm flex-1">{item}</p>
                <button
                  onClick={() => removePlanItem(i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-red-400" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                placeholder="Ajouter un créneau..."
                value={newPlanItem}
                onChange={(e) => setNewPlanItem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPlanItem())}
                className="text-sm"
              />
              <Button size="icon" variant="outline" onClick={addPlanItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Evening Review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              Review du soir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Completed */}
            <div>
              <Label className="text-xs flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Complété
              </Label>
              <div className="space-y-1.5">
                {completed.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {item}
                    <button onClick={() => setCompleted(completed.filter((_, j) => j !== i))}>
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                ))}
                <Input
                  placeholder="Ajouter..."
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) { setCompleted([...completed, val]); (e.target as HTMLInputElement).value = ""; }
                    }
                  }}
                />
              </div>
            </div>

            {/* Not Completed */}
            <div>
              <Label className="text-xs flex items-center gap-1.5 mb-2">
                <XCircle className="w-3.5 h-3.5 text-red-400" /> Pas complété
              </Label>
              <div className="space-y-1.5">
                {notCompleted.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-red-400">
                    <XCircle className="w-3.5 h-3.5" /> {item}
                    <button onClick={() => setNotCompleted(notCompleted.filter((_, j) => j !== i))}>
                      <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-400" />
                    </button>
                  </div>
                ))}
                <Input
                  placeholder="Ajouter..."
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) { setNotCompleted([...notCompleted, val]); (e.target as HTMLInputElement).value = ""; }
                    }
                  }}
                />
              </div>
            </div>

            {/* Blockers */}
            <div>
              <Label className="text-xs mb-2">Blocages</Label>
              <Textarea
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="Qu'est-ce qui t'a bloqué ?"
                className="text-sm"
              />
            </div>

            {/* Mood */}
            <div>
              <Label className="text-xs flex items-center gap-1.5 mb-2">
                <Smile className="w-3.5 h-3.5" /> Humeur ({mood}/10)
              </Label>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span><span>5</span><span>10</span>
              </div>
            </div>

            {/* Lessons */}
            <div>
              <Label className="text-xs flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" /> Leçons apprises
              </Label>
              <Textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="Qu'as-tu appris aujourd'hui ?"
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cowork Insights */}
      {existingLog?.coworkInsights && (
        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              Claude Cowork — Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{existingLog.coworkInsights}</p>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Sauvegarder
        </Button>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Historique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs
            .filter((l) => l.date !== selectedDate)
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 7)
            .map((log) => (
              <button
                key={log.date}
                onClick={() => loadDate(log.date)}
                className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium">{formatDate(log.date)}</p>
                  <p className="text-xs text-muted-foreground">{log.morningPlan.length} créneaux planifiés</p>
                </div>
                <div className="flex items-center gap-2">
                  {log.eveningReview && (
                    <Badge variant="secondary" className="text-[10px]">
                      Humeur: {log.eveningReview.mood}/10
                    </Badge>
                  )}
                  {log.coworkInsights && <Bot className="w-3.5 h-3.5 text-purple-400" />}
                </div>
              </button>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
