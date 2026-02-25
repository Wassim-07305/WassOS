"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { createRevenue, createExpense } from "@/app/actions";
import type { Finances, Project } from "@/types";

export function FinancesView({ finances, projects }: { finances: Finances; projects: Project[] }) {
  const [showNewRevenue, setShowNewRevenue] = useState(false);
  const [showNewExpense, setShowNewExpense] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  // Monthly stats
  const monthlyRevenue = finances.revenue
    .filter((r) => r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + r.amount, 0);

  const monthlyExpenses = finances.expenses
    .filter((e) => e.date.startsWith(currentMonth))
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = monthlyRevenue - monthlyExpenses;

  // Last 6 months chart data
  const chartData = useMemo(() => {
    const months: { month: string; label: string; revenue: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("fr-FR", { month: "short" });
      const revenue = finances.revenue.filter((r) => r.date.startsWith(key)).reduce((s, r) => s + r.amount, 0);
      const expenses = finances.expenses.filter((e) => e.date.startsWith(key)).reduce((s, e) => s + e.amount, 0);
      months.push({ month: key, label, revenue, expenses });
    }
    return months;
  }, [finances]);

  const maxChartValue = Math.max(...chartData.map((d) => Math.max(d.revenue, d.expenses)), 1);

  // Expected revenue from active projects
  const expectedRevenue = projects
    .filter((p) => p.status === "en-cours" || p.status === "livré")
    .reduce((sum, p) => sum + (p.price - p.paidAmount), 0);

  const maintenanceRevenue = projects
    .filter((p) => p.status === "maintenance")
    .reduce((sum, p) => sum + p.maintenancePriceMonthly, 0);

  const getProjectName = (id: string) => projects.find((p) => p.id === id)?.name || "—";

  const recurringExpenses = finances.expenses.filter((e) => e.recurring);
  const totalRecurring = recurringExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Finances</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowNewExpense(true)}>
            <ArrowDownRight className="w-4 h-4 mr-2" />
            Dépense
          </Button>
          <Button onClick={() => setShowNewRevenue(true)}>
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Revenu
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenus du mois</p>
                <p className="text-2xl font-bold mt-1 text-green-400">{formatCurrency(monthlyRevenue)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Dépenses du mois</p>
                <p className="text-2xl font-bold mt-1 text-red-400">{formatCurrency(monthlyExpenses)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bénéfice net</p>
                <p className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {formatCurrency(netProfit)}
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Revenus attendus</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(expectedRevenue)}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              + {formatCurrency(maintenanceRevenue)}/mois en maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Chart */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Évolution CA — 6 derniers mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 h-48">
                {chartData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex items-end gap-1 w-full h-40">
                      <div
                        className="flex-1 bg-green-500/30 rounded-t-sm transition-all hover:bg-green-500/50"
                        style={{ height: `${(d.revenue / maxChartValue) * 100}%` }}
                        title={`Revenus: ${formatCurrency(d.revenue)}`}
                      />
                      <div
                        className="flex-1 bg-red-500/30 rounded-t-sm transition-all hover:bg-red-500/50"
                        style={{ height: `${(d.expenses / maxChartValue) * 100}%` }}
                        title={`Dépenses: ${formatCurrency(d.expenses)}`}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground capitalize">{d.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Revenus</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Dépenses</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recurring Expenses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dépenses récurrentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recurringExpenses.map((exp) => (
              <div key={exp.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm">{exp.label}</p>
                  <p className="text-[10px] text-muted-foreground">{exp.category} — {exp.recurringFrequency}</p>
                </div>
                <span className="text-sm font-semibold text-red-400">-{formatCurrency(exp.amount)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
              <span>Total mensuel</span>
              <span className="text-red-400">-{formatCurrency(totalRecurring)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Derniers revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {finances.revenue
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 10)
              .map((rev) => (
                <div key={rev.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm">{getProjectName(rev.projectId)}</p>
                      <p className="text-[10px] text-muted-foreground">{rev.type} — {rev.method}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-400">+{formatCurrency(rev.amount)}</p>
                    <p className="text-[10px] text-muted-foreground">{formatDate(rev.date)}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* New Revenue Dialog */}
      <Dialog open={showNewRevenue} onOpenChange={setShowNewRevenue}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau revenu</DialogTitle>
            <DialogDescription>Enregistrer un paiement reçu</DialogDescription>
          </DialogHeader>
          <form action={async (fd) => { await createRevenue(fd); setShowNewRevenue(false); }} className="space-y-4">
            <div className="space-y-2">
              <Label>Projet</Label>
              <Select name="projectId" required>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Montant (€)</Label>
                <Input name="amount" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select name="type" defaultValue="acompte">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acompte">Acompte</SelectItem>
                    <SelectItem value="paiement-final">Paiement final</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input name="date" type="date" defaultValue={today} required />
              </div>
              <div className="space-y-2">
                <Label>Méthode</Label>
                <Select name="method" defaultValue="virement">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virement">Virement</SelectItem>
                    <SelectItem value="carte">Carte</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="espèces">Espèces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNewRevenue(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* New Expense Dialog */}
      <Dialog open={showNewExpense} onOpenChange={setShowNewExpense}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle dépense</DialogTitle>
            <DialogDescription>Enregistrer une dépense</DialogDescription>
          </DialogHeader>
          <form action={async (fd) => { await createExpense(fd); setShowNewExpense(false); }} className="space-y-4">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input name="label" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Montant (€)</Label>
                <Input name="amount" type="number" required />
              </div>
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select name="category" defaultValue="outils">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="outils">Outils</SelectItem>
                    <SelectItem value="formation">Formation</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="bureau">Bureau</SelectItem>
                    <SelectItem value="transport">Transport</SelectItem>
                    <SelectItem value="nourriture">Nourriture</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input name="date" type="date" defaultValue={today} required />
              </div>
              <div className="space-y-2">
                <Label>Récurrent ?</Label>
                <Select name="recurring" defaultValue="false">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Non</SelectItem>
                    <SelectItem value="true">Oui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNewExpense(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
