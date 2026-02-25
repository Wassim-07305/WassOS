"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Flame, ThermometerSun, ThermometerSnowflake, Mail, Calendar, MoveRight } from "lucide-react";
import { formatCurrency, formatDateShort, isOverdue } from "@/lib/utils";
import { createLead, editLead } from "@/app/actions";
import type { Lead, LeadStatus } from "@/types";

const columns: { status: LeadStatus; label: string; color: string }[] = [
  { status: "nouveau", label: "Nouveau", color: "border-t-blue-500" },
  { status: "premier-contact", label: "Premier contact", color: "border-t-cyan-500" },
  { status: "call-planifié", label: "Call planifié", color: "border-t-yellow-500" },
  { status: "proposition-envoyée", label: "Proposition envoyée", color: "border-t-orange-500" },
  { status: "négociation", label: "Négociation", color: "border-t-purple-500" },
  { status: "gagné", label: "Gagné", color: "border-t-green-500" },
  { status: "perdu", label: "Perdu", color: "border-t-red-500" },
];

function getTemperature(lead: Lead): "chaud" | "tiède" | "froid" {
  if (lead.tags.includes("chaud")) return "chaud";
  if (lead.tags.includes("froid")) return "froid";
  return "tiède";
}

function TemperatureIcon({ temp }: { temp: "chaud" | "tiède" | "froid" }) {
  if (temp === "chaud") return <Flame className="w-3 h-3 text-orange-400" />;
  if (temp === "tiède") return <ThermometerSun className="w-3 h-3 text-yellow-400" />;
  return <ThermometerSnowflake className="w-3 h-3 text-blue-400" />;
}

export function LeadsPipeline({ leads }: { leads: Lead[] }) {
  const searchParams = useSearchParams();
  const [showNew, setShowNew] = useState(searchParams.get("new") === "true");

  const moveToNext = async (lead: Lead) => {
    const order: LeadStatus[] = ["nouveau", "premier-contact", "call-planifié", "proposition-envoyée", "négociation", "gagné"];
    const currentIndex = order.indexOf(lead.status);
    if (currentIndex < order.length - 1) {
      await editLead(lead.id, {
        status: order[currentIndex + 1],
        lastContactDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  const totalPipelineValue = leads
    .filter((l) => l.status !== "gagné" && l.status !== "perdu")
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {leads.length} leads — Valeur pipeline: {formatCurrency(totalPipelineValue)}
          </p>
        </div>
        <Button onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau lead
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          return (
            <div key={col.status} className="flex-shrink-0 w-72">
              <div className={`border-t-2 ${col.color} bg-muted/30 rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">{col.label}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {colLeads.length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {colLeads.map((lead) => {
                    const temp = getTemperature(lead);
                    return (
                      <Card key={lead.id} className="bg-card hover:border-primary/30 transition-colors">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-1.5">
                              <TemperatureIcon temp={temp} />
                              <p className="text-sm font-medium">{lead.name}</p>
                            </div>
                            <span className="text-xs font-semibold text-green-400">
                              {formatCurrency(lead.estimatedValue)}
                            </span>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">{lead.notes}</p>

                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" /> {lead.source}
                            </span>
                            {lead.nextFollowUpDate && (
                              <span className={`flex items-center gap-1 ${isOverdue(lead.nextFollowUpDate) ? "text-red-400" : ""}`}>
                                <Calendar className="w-3 h-3" /> {formatDateShort(lead.nextFollowUpDate)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 flex-wrap">
                            {lead.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {col.status !== "gagné" && col.status !== "perdu" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="w-full h-7 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => moveToNext(lead)}
                            >
                              <MoveRight className="w-3 h-3 mr-1" />
                              Avancer
                            </Button>
                          )}
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

      {/* New Lead Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau lead</DialogTitle>
            <DialogDescription>Ajouter un prospect à votre pipeline</DialogDescription>
          </DialogHeader>
          <form
            action={async (formData) => {
              await createLead(formData);
              setShowNew(false);
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Input id="source" name="source" placeholder="LinkedIn, Instagram..." required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Valeur estimée (€)</Label>
                <Input id="estimatedValue" name="estimatedValue" type="number" defaultValue={4000} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextFollowUpDate">Prochain follow-up</Label>
                <Input id="nextFollowUpDate" name="nextFollowUpDate" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
              <Input id="tags" name="tags" placeholder="coach, chaud, linkedin..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowNew(false)}>
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
