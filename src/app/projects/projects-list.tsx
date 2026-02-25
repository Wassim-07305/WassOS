"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { Plus, Calendar, DollarSign, User, Tag } from "lucide-react";
import { formatCurrency, formatDate, daysUntil, statusColor, priorityColor } from "@/lib/utils";
import { createProject } from "@/app/actions";
import type { Client, Project, ProjectStatus } from "@/types";

const statusColumns: { status: ProjectStatus; label: string }[] = [
  { status: "à-faire", label: "À faire" },
  { status: "en-cours", label: "En cours" },
  { status: "livré", label: "Livré" },
  { status: "maintenance", label: "Maintenance" },
  { status: "terminé", label: "Terminé" },
];

export function ProjectsList({ projects, clients }: { projects: Project[]; clients: Client[] }) {
  const searchParams = useSearchParams();
  const [showNew, setShowNew] = useState(searchParams.get("new") === "true");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");

  const getClient = (id: string) => clients.find((c) => c.id === id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} projets</p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau projet
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")}>
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {projects.map((project) => {
            const client = getClient(project.clientId);
            const daysLeft = daysUntil(project.estimatedEndDate);
            const currentPhase = project.phases.find((ph) => ph.status === "en-cours");

            return (
              <Card
                key={project.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedProject(project)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-base">{project.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={statusColor(project.status)}>
                        {project.status}
                      </Badge>
                      <Badge variant="secondary" className={priorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> {client?.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {project.status === "en-cours" && daysLeft >= 0
                        ? `${daysLeft}j restants`
                        : project.status === "en-cours" && daysLeft < 0
                        ? `${Math.abs(daysLeft)}j de retard`
                        : formatDate(project.estimatedEndDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      {formatCurrency(project.paidAmount)} / {formatCurrency(project.price)}
                    </span>
                    {currentPhase && (
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" /> {currentPhase.name}
                      </span>
                    )}
                  </div>

                  {/* ESA Timeline */}
                  <div className="flex gap-1.5">
                    {project.phases.map((phase) => (
                      <div key={phase.id} className="flex-1">
                        <div
                          className={`h-2.5 rounded-full transition-colors ${
                            phase.status === "terminé"
                              ? "bg-green-500"
                              : phase.status === "en-cours"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-secondary"
                          }`}
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">{phase.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {statusColumns.map((col) => {
              const colProjects = projects.filter((p) => p.status === col.status);
              return (
                <div key={col.status} className="flex-shrink-0 w-72">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">{col.label}</h3>
                      <Badge variant="secondary" className="text-[10px]">{colProjects.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {colProjects.map((project) => {
                        const client = getClient(project.clientId);
                        return (
                          <Card
                            key={project.id}
                            className="cursor-pointer hover:border-primary/30 transition-colors"
                            onClick={() => setSelectedProject(project)}
                          >
                            <CardContent className="p-3 space-y-2">
                              <p className="text-sm font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">{client?.name}</p>
                              <div className="flex justify-between items-center">
                                <Badge variant="secondary" className={`text-[10px] ${priorityColor(project.priority)}`}>
                                  {project.priority}
                                </Badge>
                                <span className="text-xs font-semibold">{formatCurrency(project.price)}</span>
                              </div>
                              <div className="flex gap-1">
                                {project.phases.map((phase) => (
                                  <div
                                    key={phase.id}
                                    className={`flex-1 h-1.5 rounded-full ${
                                      phase.status === "terminé"
                                        ? "bg-green-500"
                                        : phase.status === "en-cours"
                                        ? "bg-blue-500"
                                        : "bg-secondary"
                                    }`}
                                  />
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Detail */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProject && (() => {
            const client = getClient(selectedProject.clientId);
            const paymentProgress = (selectedProject.paidAmount / selectedProject.price) * 100;
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedProject.name}</DialogTitle>
                  <DialogDescription>{selectedProject.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{client?.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Statut</p>
                      <Badge variant="secondary" className={statusColor(selectedProject.status)}>
                        {selectedProject.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date début</p>
                      <p>{formatDate(selectedProject.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date fin estimée</p>
                      <p>{formatDate(selectedProject.estimatedEndDate)}</p>
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Paiement</span>
                      <span>{formatCurrency(selectedProject.paidAmount)} / {formatCurrency(selectedProject.price)}</span>
                    </div>
                    <Progress value={paymentProgress} indicatorClassName="bg-green-500" />
                  </div>

                  {/* ESA Timeline */}
                  <div>
                    <p className="text-sm font-medium mb-3">Timeline ESA</p>
                    <div className="space-y-2">
                      {selectedProject.phases.map((phase, i) => (
                        <div key={phase.id} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            phase.status === "terminé"
                              ? "bg-green-500/20 text-green-400"
                              : phase.status === "en-cours"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-secondary text-muted-foreground"
                          }`}>
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{phase.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(phase.startDate)} → {formatDate(phase.endDate)}
                            </p>
                          </div>
                          <Badge variant="secondary" className={statusColor(phase.status)}>
                            {phase.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedProject.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      {selectedProject.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* New Project Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau projet</DialogTitle>
            <DialogDescription>Créer un nouveau projet ESA</DialogDescription>
          </DialogHeader>
          <form
            action={async (formData) => {
              await createProject(formData);
              setShowNew(false);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select name="clientId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nom du projet</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input id="price" name="price" type="number" defaultValue={4000} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select name="priority" defaultValue="moyenne">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="basse">Basse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenancePriceMonthly">Maintenance/mois (€)</Label>
                <Input id="maintenancePriceMonthly" name="maintenancePriceMonthly" type="number" defaultValue={200} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input id="tags" name="tags" placeholder="coaching, mobile, ESA..." />
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
