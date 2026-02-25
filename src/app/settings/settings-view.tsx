"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Target, Clock, Save } from "lucide-react";
import { saveConfig } from "@/app/actions";
import type { Config } from "@/types";

export function SettingsView({ config }: { config: Config }) {
  const [owner, setOwner] = useState(config.owner);
  const [goals, setGoals] = useState(config.goals);
  const [workHours, setWorkHours] = useState(config.workHours);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await saveConfig({ owner, goals, workHours });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configuration de WassOS</p>
      </div>

      {/* Owner Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input value={owner.name} onChange={(e) => setOwner({ ...owner, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Business</Label>
              <Input value={owner.business} onChange={(e) => setOwner({ ...owner, business: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Méthode</Label>
              <Input value={owner.method} onChange={(e) => setOwner({ ...owner, method: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Localisation</Label>
              <Input value={owner.location} onChange={(e) => setOwner({ ...owner, location: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prix de base (€)</Label>
              <Input type="number" value={owner.basePrice} onChange={(e) => setOwner({ ...owner, basePrice: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Semaines de livraison</Label>
              <Input type="number" value={owner.deliveryWeeks} onChange={(e) => setOwner({ ...owner, deliveryWeeks: Number(e.target.value) })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-400" />
            Objectifs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Objectif CA mensuel (€)</Label>
              <Input type="number" value={goals.monthlyRevenueTarget} onChange={(e) => setGoals({ ...goals, monthlyRevenueTarget: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Max projets actifs</Label>
              <Input type="number" value={goals.maxActiveProjects} onChange={(e) => setGoals({ ...goals, maxActiveProjects: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Messages prospection / semaine</Label>
              <Input type="number" value={goals.weeklyProspectingMessages} onChange={(e) => setGoals({ ...goals, weeklyProspectingMessages: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Contenus / semaine</Label>
              <Input type="number" value={goals.weeklyContentPieces} onChange={(e) => setGoals({ ...goals, weeklyContentPieces: Number(e.target.value) })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            Horaires de travail
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Début de journée</Label>
              <Input type="time" value={workHours.start} onChange={(e) => setWorkHours({ ...workHours, start: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fin de journée</Label>
              <Input type="time" value={workHours.end} onChange={(e) => setWorkHours({ ...workHours, end: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Début pause</Label>
              <Input type="time" value={workHours.breakStart} onChange={(e) => setWorkHours({ ...workHours, breakStart: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Fin pause</Label>
              <Input type="time" value={workHours.breakEnd} onChange={(e) => setWorkHours({ ...workHours, breakEnd: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Sauvegardé !" : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
