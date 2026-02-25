import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}`;
}

export function daysUntil(date: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function isOverdue(date: string): boolean {
  return daysUntil(date) < 0;
}

export function isToday(date: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return date === today;
}

export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    dev: "bg-blue-500/20 text-blue-400",
    design: "bg-pink-500/20 text-pink-400",
    client: "bg-green-500/20 text-green-400",
    admin: "bg-gray-500/20 text-gray-400",
    contenu: "bg-yellow-500/20 text-yellow-400",
    prospection: "bg-orange-500/20 text-orange-400",
    perso: "bg-purple-500/20 text-purple-400",
  };
  return colors[category] || "bg-gray-500/20 text-gray-400";
}

export function priorityColor(priority: string): string {
  const colors: Record<string, string> = {
    haute: "bg-red-500/20 text-red-400",
    moyenne: "bg-yellow-500/20 text-yellow-400",
    basse: "bg-green-500/20 text-green-400",
  };
  return colors[priority] || "bg-gray-500/20 text-gray-400";
}

export function statusColor(status: string): string {
  const colors: Record<string, string> = {
    "à-faire": "bg-gray-500/20 text-gray-400",
    "en-cours": "bg-blue-500/20 text-blue-400",
    "terminé": "bg-green-500/20 text-green-400",
    "livré": "bg-emerald-500/20 text-emerald-400",
    "maintenance": "bg-purple-500/20 text-purple-400",
    "actif": "bg-green-500/20 text-green-400",
    "inactif": "bg-gray-500/20 text-gray-400",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400";
}

export function leadStatusColor(status: string): string {
  const colors: Record<string, string> = {
    "nouveau": "bg-blue-500/20 text-blue-400",
    "premier-contact": "bg-cyan-500/20 text-cyan-400",
    "call-planifié": "bg-yellow-500/20 text-yellow-400",
    "proposition-envoyée": "bg-orange-500/20 text-orange-400",
    "négociation": "bg-purple-500/20 text-purple-400",
    "gagné": "bg-green-500/20 text-green-400",
    "perdu": "bg-red-500/20 text-red-400",
    "en-pause": "bg-gray-500/20 text-gray-400",
  };
  return colors[status] || "bg-gray-500/20 text-gray-400";
}
