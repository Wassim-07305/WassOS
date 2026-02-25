import { getClients, getProjects, getTasks, getFinances, getLeads, getConfig } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  FolderKanban,
  AlertTriangle,
  Clock,
  Target,
  TrendingUp,
  CheckCircle2,
  Circle,
  Flame,
} from "lucide-react";
import { formatCurrency, formatDateShort, daysUntil, isOverdue, categoryColor, priorityColor } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const [clients, projects, tasks, finances, leads, config] = await Promise.all([
    getClients(),
    getProjects(),
    getTasks(),
    getFinances(),
    getLeads(),
    getConfig(),
  ]);

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  // KPIs
  const monthlyRevenue = finances.revenue
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.amount, 0);

  const monthlyExpenses = finances.expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const activeProjects = projects.filter((p) => p.status === "en-cours");
  const overdueTasks = tasks.filter((t) => t.status !== "terminé" && t.dueDate && t.dueDate < today);
  const hotLeads = leads.filter((l) => l.tags.includes("chaud") && l.status !== "gagné" && l.status !== "perdu");

  const pendingPayments = projects
    .filter((p) => p.paymentStatus !== "payé" && p.status !== "terminé")
    .reduce((sum, p) => sum + (p.price - p.paidAmount), 0);

  // Today's tasks
  const todayTasks = tasks.filter(
    (t) => t.status !== "terminé" && (t.dueDate === today || (t.dueDate && t.dueDate < today))
  ).sort((a, b) => {
    const prio = { haute: 0, moyenne: 1, basse: 2 };
    return prio[a.priority] - prio[b.priority];
  });

  // Alerts
  const alerts: { type: "warning" | "danger" | "info"; message: string; link: string }[] = [];

  projects.forEach((p) => {
    if (p.status === "en-cours" && p.estimatedEndDate) {
      const d = daysUntil(p.estimatedEndDate);
      if (d <= 3 && d >= 0) {
        alerts.push({ type: "warning", message: `${p.name} — deadline dans ${d}j`, link: "/projects" });
      } else if (d < 0) {
        alerts.push({ type: "danger", message: `${p.name} — en retard de ${Math.abs(d)}j`, link: "/projects" });
      }
    }
  });

  leads.forEach((l) => {
    if (l.nextFollowUpDate && l.nextFollowUpDate <= today && l.status !== "gagné" && l.status !== "perdu") {
      alerts.push({ type: "info", message: `Follow-up en retard : ${l.name}`, link: "/leads" });
    }
  });

  projects.forEach((p) => {
    if (p.paymentStatus === "en-retard" || (p.paymentStatus === "acompte-reçu" && p.status === "livré")) {
      alerts.push({ type: "danger", message: `Paiement en attente : ${p.name} (${formatCurrency(p.price - p.paidAmount)})`, link: "/finances" });
    }
  });

  const revenueTarget = config.goals.monthlyRevenueTarget;
  const revenueProgress = Math.min((monthlyRevenue / revenueTarget) * 100, 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Bonjour Wass — {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">CA du mois</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(monthlyRevenue)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-400" />
              </div>
            </div>
            <div className="mt-3">
              <Progress value={revenueProgress} indicatorClassName="bg-green-500" className="h-1.5" />
              <p className="text-[10px] text-muted-foreground mt-1">
                {Math.round(revenueProgress)}% de l&apos;objectif ({formatCurrency(revenueTarget)})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Projets actifs</p>
                <p className="text-2xl font-bold mt-1">{activeProjects.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-blue-400" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              Max: {config.goals.maxActiveProjects} projets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tâches en retard</p>
                <p className="text-2xl font-bold mt-1">{overdueTasks.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              {tasks.filter((t) => t.status !== "terminé").length} tâches restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Paiements attendus</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(pendingPayments)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Leads chauds</p>
                <p className="text-2xl font-bold mt-1">{hotLeads.length}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-400" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              {leads.length} leads au total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Project Timeline */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Timeline des projets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {projects
                .filter((p) => p.status === "en-cours" || p.status === "à-faire")
                .map((project) => {
                  const client = clients.find((c) => c.id === project.clientId);
                  const daysLeft = daysUntil(project.estimatedEndDate);

                  return (
                    <div key={project.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{project.name}</p>
                          <p className="text-xs text-muted-foreground">{client?.name}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className={`text-[10px] ${daysLeft < 0 ? "bg-red-500/20 text-red-400" : daysLeft <= 5 ? "bg-yellow-500/20 text-yellow-400" : ""}`}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)}j de retard` : `${daysLeft}j restants`}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {project.phases.map((phase) => (
                          <div key={phase.id} className="flex-1">
                            <div
                              className={`h-2 rounded-full ${
                                phase.status === "terminé"
                                  ? "bg-green-500"
                                  : phase.status === "en-cours"
                                  ? "bg-blue-500"
                                  : "bg-secondary"
                              }`}
                            />
                            <p className="text-[9px] text-muted-foreground mt-1 truncate">{phase.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </CardContent>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Tâches du jour
                </CardTitle>
                <Link href="/tasks" className="text-xs text-primary hover:underline">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Aucune tâche pour aujourd&apos;hui</p>
              ) : (
                todayTasks.slice(0, 8).map((task) => {
                  const project = task.projectId ? projects.find((p) => p.id === task.projectId) : null;
                  return (
                    <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{task.title}</p>
                        {project && <p className="text-[10px] text-muted-foreground">{project.name}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={`text-[10px] ${categoryColor(task.category)}`}>
                          {task.category}
                        </Badge>
                        <Badge variant="secondary" className={`text-[10px] ${priorityColor(task.priority)}`}>
                          {task.priority}
                        </Badge>
                        {task.dueDate && isOverdue(task.dueDate) && (
                          <Badge variant="secondary" className="text-[10px] bg-red-500/20 text-red-400">
                            En retard
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Leads */}
        <div className="space-y-6">
          {/* Alerts */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Alertes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune alerte</p>
              ) : (
                alerts.map((alert, i) => (
                  <Link
                    key={i}
                    href={alert.link}
                    className={`block px-3 py-2 rounded-lg text-xs transition-colors hover:bg-muted/50 ${
                      alert.type === "danger"
                        ? "bg-red-500/5 text-red-400 border border-red-500/20"
                        : alert.type === "warning"
                        ? "bg-yellow-500/5 text-yellow-400 border border-yellow-500/20"
                        : "bg-blue-500/5 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {alert.message}
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Hot Leads */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-400" />
                  Leads chauds
                </CardTitle>
                <Link href="/leads" className="text-xs text-primary hover:underline">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {hotLeads.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun lead chaud</p>
              ) : (
                hotLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{lead.name}</p>
                      <p className="text-[10px] text-muted-foreground">{lead.source} — {formatCurrency(lead.estimatedValue)}</p>
                    </div>
                    {lead.nextFollowUpDate && (
                      <Badge variant="secondary" className={`text-[10px] ${isOverdue(lead.nextFollowUpDate) ? "bg-red-500/20 text-red-400" : ""}`}>
                        {isOverdue(lead.nextFollowUpDate) ? "En retard" : formatDateShort(lead.nextFollowUpDate)}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-medium">Résumé financier</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Revenus</span>
                <span className="text-green-400 font-medium">{formatCurrency(monthlyRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dépenses</span>
                <span className="text-red-400 font-medium">-{formatCurrency(monthlyExpenses)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
                <span>Bénéfice</span>
                <span className={monthlyRevenue - monthlyExpenses >= 0 ? "text-green-400" : "text-red-400"}>
                  {formatCurrency(monthlyRevenue - monthlyExpenses)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
