"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Circle,
  CircleDot,
  CheckCircle2,
  Clock,
  Bot,
  RefreshCw,
} from "lucide-react";
import { categoryColor, priorityColor, formatDateShort, isOverdue } from "@/lib/utils";
import { createTask, editTask } from "@/app/actions";
import type { Client, Project, Task, TaskStatus } from "@/types";

const statusColumns: { status: TaskStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "à-faire", label: "À faire", icon: Circle },
  { status: "en-cours", label: "En cours", icon: CircleDot },
  { status: "terminé", label: "Terminé", icon: CheckCircle2 },
];

export function TasksView({ tasks, projects }: { tasks: Task[]; projects: Project[]; clients: Client[] }) {
  const searchParams = useSearchParams();
  const [showNew, setShowNew] = useState(searchParams.get("new") === "true");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("tous");
  const [filterPriority, setFilterPriority] = useState("tous");
  const [filterProject, setFilterProject] = useState("tous");
  const [view, setView] = useState<"list" | "kanban">("list");

  const filtered = tasks.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCategory !== "tous" && t.category !== filterCategory) return false;
    if (filterPriority !== "tous" && t.priority !== filterPriority) return false;
    if (filterProject !== "tous" && t.projectId !== filterProject) return false;
    return true;
  });

  const getProjectName = (id: string | null) => {
    if (!id) return null;
    return projects.find((p) => p.id === id)?.name;
  };

  const toggleStatus = async (task: Task) => {
    const next: Record<TaskStatus, TaskStatus> = {
      "à-faire": "en-cours",
      "en-cours": "terminé",
      "terminé": "à-faire",
    };
    await editTask(task.id, { status: next[task.status] });
  };

  const sourceIcon = (source: string) => {
    if (source === "cowork") return <Bot className="w-3 h-3 text-purple-400" />;
    if (source === "récurrent") return <RefreshCw className="w-3 h-3 text-blue-400" />;
    return null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tâches</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {tasks.filter((t) => t.status !== "terminé").length} en cours — {tasks.filter((t) => t.status === "terminé").length} terminées
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Catégorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Toutes</SelectItem>
            <SelectItem value="dev">Dev</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="contenu">Contenu</SelectItem>
            <SelectItem value="prospection">Prospection</SelectItem>
            <SelectItem value="perso">Perso</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32"><SelectValue placeholder="Priorité" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Toutes</SelectItem>
            <SelectItem value="haute">Haute</SelectItem>
            <SelectItem value="moyenne">Moyenne</SelectItem>
            <SelectItem value="basse">Basse</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Projet" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les projets</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")}>
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-1">
          {filtered
            .sort((a, b) => {
              const prio = { haute: 0, moyenne: 1, basse: 2 };
              const statOrd = { "en-cours": 0, "à-faire": 1, "terminé": 2 };
              if (a.status !== b.status) return statOrd[a.status] - statOrd[b.status];
              return prio[a.priority] - prio[b.priority];
            })
            .map((task) => {
              const projectName = getProjectName(task.projectId);
              const StatusIcon = statusColumns.find((s) => s.status === task.status)?.icon || Circle;
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 py-2.5 px-4 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <button onClick={() => toggleStatus(task)} className="shrink-0">
                    <StatusIcon className={`w-5 h-5 ${
                      task.status === "terminé" ? "text-green-400" : task.status === "en-cours" ? "text-blue-400" : "text-muted-foreground"
                    }`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${task.status === "terminé" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      {sourceIcon(task.source)}
                    </div>
                    {projectName && <p className="text-[10px] text-muted-foreground">{projectName}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className={`text-[10px] ${categoryColor(task.category)}`}>
                      {task.category}
                    </Badge>
                    <Badge variant="secondary" className={`text-[10px] ${priorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                    {task.dueDate && (
                      <span className={`text-[10px] flex items-center gap-1 ${isOverdue(task.dueDate) && task.status !== "terminé" ? "text-red-400" : "text-muted-foreground"}`}>
                        <Clock className="w-3 h-3" />
                        {formatDateShort(task.dueDate)}
                      </span>
                    )}
                    {task.estimatedMinutes && (
                      <span className="text-[10px] text-muted-foreground">{task.estimatedMinutes}min</span>
                    )}
                  </div>
                </div>
              );
            })}
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="flex gap-4">
            {statusColumns.map((col) => {
              const colTasks = filtered.filter((t) => t.status === col.status);
              return (
                <div key={col.status} className="flex-1 min-w-0">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <col.icon className={`w-4 h-4 ${
                          col.status === "terminé" ? "text-green-400" : col.status === "en-cours" ? "text-blue-400" : "text-muted-foreground"
                        }`} />
                        <h3 className="text-sm font-medium">{col.label}</h3>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">{colTasks.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {colTasks.map((task) => (
                        <Card key={task.id} className="hover:border-primary/30 transition-colors">
                          <CardContent className="p-3 space-y-2">
                            <div className="flex items-start gap-2">
                              <p className="text-sm font-medium flex-1">{task.title}</p>
                              {sourceIcon(task.source)}
                            </div>
                            {(() => { const pn = getProjectName(task.projectId); return pn ? <p className="text-[10px] text-muted-foreground">{pn}</p> : null; })()}
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <Badge variant="secondary" className={`text-[9px] ${categoryColor(task.category)}`}>{task.category}</Badge>
                              <Badge variant="secondary" className={`text-[9px] ${priorityColor(task.priority)}`}>{task.priority}</Badge>
                              {task.dueDate && isOverdue(task.dueDate) && task.status !== "terminé" && (
                                <Badge variant="secondary" className="text-[9px] bg-red-500/20 text-red-400">En retard</Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Task Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
            <DialogDescription>Ajouter une tâche à votre liste</DialogDescription>
          </DialogHeader>
          <form
            action={async (formData) => {
              await createTask(formData);
              setShowNew(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectId">Projet</Label>
                <Select name="projectId">
                  <SelectTrigger><SelectValue placeholder="Aucun" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select name="category" defaultValue="dev">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Dev</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="contenu">Contenu</SelectItem>
                    <SelectItem value="prospection">Prospection</SelectItem>
                    <SelectItem value="perso">Perso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select name="priority" defaultValue="moyenne">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Deadline</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedMinutes">Temps estimé (min)</Label>
                <Input id="estimatedMinutes" name="estimatedMinutes" type="number" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>Annuler</Button>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
