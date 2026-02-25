// === Status & Category Types ===

export type ClientStatus = 'actif' | 'inactif' | 'archivé';
export type ProjectStatus = 'à-faire' | 'en-cours' | 'livré' | 'maintenance' | 'terminé';
export type PhaseStatus = 'à-faire' | 'en-cours' | 'terminé';
export type TaskPriority = 'haute' | 'moyenne' | 'basse';
export type TaskStatus = 'à-faire' | 'en-cours' | 'terminé';
export type TaskCategory = 'dev' | 'design' | 'client' | 'admin' | 'contenu' | 'prospection' | 'perso';
export type TaskSource = 'manuel' | 'cowork' | 'récurrent';
export type LeadStatus = 'nouveau' | 'premier-contact' | 'call-planifié' | 'proposition-envoyée' | 'négociation' | 'gagné' | 'perdu' | 'en-pause';
export type PaymentStatus = 'en-attente' | 'acompte-reçu' | 'payé' | 'en-retard';
export type PaymentMethod = 'virement' | 'carte' | 'espèces' | 'paypal' | 'stripe';
export type RevenueType = 'acompte' | 'paiement-final' | 'maintenance' | 'autre';
export type ExpenseCategory = 'outils' | 'formation' | 'marketing' | 'bureau' | 'transport' | 'nourriture' | 'autre';
export type RecurringFrequency = 'mensuel' | 'trimestriel' | 'annuel';

// === Data Models ===

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string;
  niche: string;
  source: string;
  status: ClientStatus;
  notes: string;
  createdAt: string;
}

export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  startDate: string;
  endDate: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: TaskPriority;
  price: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate: string | null;
  maintenanceStartDate: string | null;
  maintenanceEndDate: string | null;
  maintenancePriceMonthly: number;
  phases: Phase[];
  tags: string[];
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string | null;
  clientId: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate: string | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  completedAt: string | null;
  createdAt: string;
  source: TaskSource;
}

export interface Revenue {
  id: string;
  projectId: string;
  amount: number;
  type: RevenueType;
  date: string;
  method: PaymentMethod;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  recurring: boolean;
  recurringFrequency?: RecurringFrequency;
}

export interface Finances {
  revenue: Revenue[];
  expenses: Expense[];
}

export interface DailyLog {
  date: string;
  morningPlan: string[];
  eveningReview: {
    completed: string[];
    notCompleted: string[];
    blockers: string;
    mood: number;
    lessonsLearned: string;
  } | null;
  coworkInsights: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string;
  status: LeadStatus;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;
  notes: string;
  estimatedValue: number;
  tags: string[];
  createdAt: string;
}

export interface Config {
  owner: {
    name: string;
    business: string;
    method: string;
    basePrice: number;
    deliveryWeeks: number;
    location: string;
  };
  goals: {
    monthlyRevenueTarget: number;
    weeklyProspectingMessages: number;
    weeklyContentPieces: number;
    maxActiveProjects: number;
  };
  workHours: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
}
