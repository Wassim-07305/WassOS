"use server";

import { revalidatePath } from "next/cache";
import * as data from "@/lib/data";
import type {
  Client,
  Project,
  Task,
  Lead,
  DailyLog,
  Revenue,
  Expense,
  Config,
} from "@/types";

// === Client Actions ===
export async function createClient(formData: FormData) {
  const client = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    company: formData.get("company") as string,
    niche: formData.get("niche") as string,
    source: formData.get("source") as string,
    status: "actif" as const,
    notes: (formData.get("notes") as string) || "",
  };
  data.addClient(client);
  revalidatePath("/clients");
  revalidatePath("/");
}

export async function editClient(id: string, formData: FormData) {
  const updates: Partial<Client> = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    company: formData.get("company") as string,
    niche: formData.get("niche") as string,
    source: formData.get("source") as string,
    status: formData.get("status") as Client["status"],
    notes: (formData.get("notes") as string) || "",
  };
  data.updateClient(id, updates);
  revalidatePath("/clients");
  revalidatePath("/");
}

export async function removeClient(id: string) {
  data.deleteClient(id);
  revalidatePath("/clients");
  revalidatePath("/");
}

// === Project Actions ===
export async function createProject(formData: FormData) {
  const startDate = formData.get("startDate") as string;
  const start = new Date(startDate);
  const w1End = new Date(start); w1End.setDate(w1End.getDate() + 6);
  const w2Start = new Date(w1End); w2Start.setDate(w2Start.getDate() + 1);
  const w2End = new Date(w2Start); w2End.setDate(w2End.getDate() + 6);
  const w3Start = new Date(w2End); w3Start.setDate(w3Start.getDate() + 1);
  const w3End = new Date(w3Start); w3End.setDate(w3End.getDate() + 9);
  const w4Start = new Date(w3End); w4Start.setDate(w4Start.getDate() + 1);
  const w4End = new Date(start); w4End.setDate(w4End.getDate() + 27);

  const fmt = (d: Date) => d.toISOString().split("T")[0];

  const project: Omit<Project, "id" | "createdAt"> = {
    clientId: formData.get("clientId") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    status: "à-faire",
    priority: formData.get("priority") as Project["priority"],
    price: Number(formData.get("price")),
    paidAmount: 0,
    paymentStatus: "en-attente",
    startDate,
    estimatedEndDate: fmt(w4End),
    actualEndDate: null,
    maintenanceStartDate: null,
    maintenanceEndDate: null,
    maintenancePriceMonthly: Number(formData.get("maintenancePriceMonthly") || 200),
    phases: [
      { id: `phase_${Date.now()}_1`, name: "Extraction", status: "à-faire", startDate, endDate: fmt(w1End) },
      { id: `phase_${Date.now()}_2`, name: "Structuration", status: "à-faire", startDate: fmt(w2Start), endDate: fmt(w2End) },
      { id: `phase_${Date.now()}_3`, name: "Développement App", status: "à-faire", startDate: fmt(w3Start), endDate: fmt(w3End) },
      { id: `phase_${Date.now()}_4`, name: "Livraison & Feedback", status: "à-faire", startDate: fmt(w4Start), endDate: fmt(w4End) },
    ],
    tags: ((formData.get("tags") as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
  };
  data.addProject(project);
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function editProject(id: string, updates: Partial<Project>) {
  data.updateProject(id, updates);
  revalidatePath("/projects");
  revalidatePath("/");
}

export async function removeProject(id: string) {
  data.deleteProject(id);
  revalidatePath("/projects");
  revalidatePath("/");
}

// === Task Actions ===
export async function createTask(formData: FormData) {
  const task: Omit<Task, "id" | "createdAt"> = {
    projectId: (formData.get("projectId") as string) || null,
    clientId: (formData.get("clientId") as string) || null,
    title: formData.get("title") as string,
    description: (formData.get("description") as string) || "",
    status: "à-faire",
    priority: (formData.get("priority") as Task["priority"]) || "moyenne",
    category: (formData.get("category") as Task["category"]) || "dev",
    dueDate: (formData.get("dueDate") as string) || null,
    estimatedMinutes: Number(formData.get("estimatedMinutes")) || null,
    actualMinutes: null,
    completedAt: null,
    source: "manuel",
  };
  data.addTask(task);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function editTask(id: string, updates: Partial<Task>) {
  if (updates.status === "terminé" && !updates.completedAt) {
    updates.completedAt = new Date().toISOString();
  }
  data.updateTask(id, updates);
  revalidatePath("/tasks");
  revalidatePath("/");
}

export async function removeTask(id: string) {
  data.deleteTask(id);
  revalidatePath("/tasks");
  revalidatePath("/");
}

// === Lead Actions ===
export async function createLead(formData: FormData) {
  const lead: Omit<Lead, "id" | "createdAt"> = {
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    source: formData.get("source") as string,
    status: "nouveau",
    lastContactDate: null,
    nextFollowUpDate: (formData.get("nextFollowUpDate") as string) || null,
    notes: (formData.get("notes") as string) || "",
    estimatedValue: Number(formData.get("estimatedValue") || 4000),
    tags: ((formData.get("tags") as string) || "").split(",").map((t) => t.trim()).filter(Boolean),
  };
  data.addLead(lead);
  revalidatePath("/leads");
  revalidatePath("/");
}

export async function editLead(id: string, updates: Partial<Lead>) {
  data.updateLead(id, updates);
  revalidatePath("/leads");
  revalidatePath("/");
}

export async function removeLead(id: string) {
  data.deleteLead(id);
  revalidatePath("/leads");
  revalidatePath("/");
}

// === Finance Actions ===
export async function createRevenue(formData: FormData) {
  const revenue: Omit<Revenue, "id"> = {
    projectId: formData.get("projectId") as string,
    amount: Number(formData.get("amount")),
    type: formData.get("type") as Revenue["type"],
    date: formData.get("date") as string,
    method: formData.get("method") as Revenue["method"],
  };
  data.addRevenue(revenue);
  revalidatePath("/finances");
  revalidatePath("/");
}

export async function createExpense(formData: FormData) {
  const expense: Omit<Expense, "id"> = {
    label: formData.get("label") as string,
    amount: Number(formData.get("amount")),
    category: formData.get("category") as Expense["category"],
    date: formData.get("date") as string,
    recurring: formData.get("recurring") === "true",
    recurringFrequency: (formData.get("recurringFrequency") as Expense["recurringFrequency"]) || undefined,
  };
  data.addExpense(expense);
  revalidatePath("/finances");
  revalidatePath("/");
}

export async function removeRevenue(id: string) {
  data.deleteRevenue(id);
  revalidatePath("/finances");
}

export async function removeExpense(id: string) {
  data.deleteExpense(id);
  revalidatePath("/finances");
}

// === Daily Log Actions ===
export async function saveDailyLog(log: DailyLog) {
  data.upsertDailyLog(log);
  revalidatePath("/daily");
  revalidatePath("/");
}

// === Config Actions ===
export async function saveConfig(updates: Partial<Config>) {
  data.updateConfig(updates);
  revalidatePath("/settings");
  revalidatePath("/");
}
