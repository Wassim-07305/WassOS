import { supabase } from "./supabase";
import type {
  Client,
  Project,
  Phase,
  Task,
  Finances,
  Revenue,
  Expense,
  DailyLog,
  Lead,
  Config,
} from "@/types";

// === Mappers (snake_case DB → camelCase App) ===

type Row = any; // eslint-disable-line

function mapClient(row: Row): Client {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    niche: row.niche,
    source: row.source,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function mapPhase(row: Row): Phase {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
  };
}

function mapProject(row: Row, phases: Phase[]): Project {
  return {
    id: row.id,
    clientId: row.client_id,
    name: row.name,
    description: row.description,
    status: row.status,
    priority: row.priority,
    price: Number(row.price),
    paidAmount: Number(row.paid_amount),
    paymentStatus: row.payment_status,
    startDate: row.start_date,
    estimatedEndDate: row.estimated_end_date,
    actualEndDate: row.actual_end_date,
    maintenanceStartDate: row.maintenance_start_date,
    maintenanceEndDate: row.maintenance_end_date,
    maintenancePriceMonthly: Number(row.maintenance_price_monthly),
    phases,
    tags: row.tags || [],
    createdAt: row.created_at,
  };
}

function mapTask(row: Row): Task {
  return {
    id: row.id,
    projectId: row.project_id,
    clientId: row.client_id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    dueDate: row.due_date,
    estimatedMinutes: row.estimated_minutes,
    actualMinutes: row.actual_minutes,
    completedAt: row.completed_at,
    createdAt: row.created_at,
    source: row.source,
  };
}

function mapRevenue(row: Row): Revenue {
  return {
    id: row.id,
    projectId: row.project_id,
    amount: Number(row.amount),
    type: row.type,
    date: row.date,
    method: row.method,
  };
}

function mapExpense(row: Row): Expense {
  return {
    id: row.id,
    label: row.label,
    amount: Number(row.amount),
    category: row.category,
    date: row.date,
    recurring: row.recurring,
    recurringFrequency: row.recurring_frequency,
  };
}

function mapLead(row: Row): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    source: row.source,
    status: row.status,
    lastContactDate: row.last_contact_date,
    nextFollowUpDate: row.next_follow_up_date,
    notes: row.notes,
    estimatedValue: Number(row.estimated_value),
    tags: row.tags || [],
    createdAt: row.created_at,
  };
}

function mapDailyLog(row: Row): DailyLog {
  return {
    date: row.date,
    morningPlan: row.morning_plan || [],
    eveningReview: row.evening_review,
    coworkInsights: row.cowork_insights,
  };
}

// === Clients ===

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapClient);
}

export async function getClient(id: string): Promise<Client | undefined> {
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapClient(data);
}

export async function addClient(client: Omit<Client, "id" | "createdAt">): Promise<Client> {
  const { data, error } = await supabase
    .from("clients")
    .insert({
      id: `client_${Date.now()}`,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      niche: client.niche,
      source: client.source,
      status: client.status,
      notes: client.notes,
    })
    .select()
    .single();
  if (error) throw error;
  return mapClient(data);
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.company !== undefined) dbUpdates.company = updates.company;
  if (updates.niche !== undefined) dbUpdates.niche = updates.niche;
  if (updates.source !== undefined) dbUpdates.source = updates.source;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

  const { data, error } = await supabase
    .from("clients")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapClient(data);
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

// === Projects ===

export async function getProjects(): Promise<Project[]> {
  const { data: projectRows, error: pErr } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (pErr) throw pErr;

  const { data: phaseRows, error: phErr } = await supabase
    .from("project_phases")
    .select("*")
    .order("sort_order", { ascending: true });
  if (phErr) throw phErr;

  const phasesByProject = new Map<string, Phase[]>();
  for (const row of phaseRows || []) {
    const pid = row.project_id;
    if (!phasesByProject.has(pid)) phasesByProject.set(pid, []);
    phasesByProject.get(pid)!.push(mapPhase(row));
  }

  return (projectRows || []).map((row) =>
    mapProject(row, phasesByProject.get(row.id) || [])
  );
}

export async function getProject(id: string): Promise<Project | undefined> {
  const { data: row, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;

  const { data: phaseRows } = await supabase
    .from("project_phases")
    .select("*")
    .eq("project_id", id)
    .order("sort_order", { ascending: true });

  const phases = (phaseRows || []).map(mapPhase);
  return mapProject(row, phases);
}

export async function addProject(
  project: Omit<Project, "id" | "createdAt">,
  phases: { name: string; status: string; startDate: string; endDate: string }[]
): Promise<Project> {
  const projectId = `proj_${Date.now()}`;

  const { data: row, error } = await supabase
    .from("projects")
    .insert({
      id: projectId,
      client_id: project.clientId,
      name: project.name,
      description: project.description,
      status: project.status,
      priority: project.priority,
      price: project.price,
      paid_amount: project.paidAmount,
      payment_status: project.paymentStatus,
      start_date: project.startDate,
      estimated_end_date: project.estimatedEndDate,
      actual_end_date: project.actualEndDate,
      maintenance_start_date: project.maintenanceStartDate,
      maintenance_end_date: project.maintenanceEndDate,
      maintenance_price_monthly: project.maintenancePriceMonthly,
      tags: project.tags,
    })
    .select()
    .single();
  if (error) throw error;

  const phaseInserts = phases.map((p, i) => ({
    id: `phase_${Date.now()}_${i + 1}`,
    project_id: projectId,
    name: p.name,
    status: p.status,
    start_date: p.startDate,
    end_date: p.endDate,
    sort_order: i + 1,
  }));

  const { data: phaseRows, error: phErr } = await supabase
    .from("project_phases")
    .insert(phaseInserts)
    .select();
  if (phErr) throw phErr;

  return mapProject(row, (phaseRows || []).map(mapPhase));
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.paidAmount !== undefined) dbUpdates.paid_amount = updates.paidAmount;
  if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
  if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
  if (updates.estimatedEndDate !== undefined) dbUpdates.estimated_end_date = updates.estimatedEndDate;
  if (updates.actualEndDate !== undefined) dbUpdates.actual_end_date = updates.actualEndDate;
  if (updates.maintenanceStartDate !== undefined) dbUpdates.maintenance_start_date = updates.maintenanceStartDate;
  if (updates.maintenanceEndDate !== undefined) dbUpdates.maintenance_end_date = updates.maintenanceEndDate;
  if (updates.maintenancePriceMonthly !== undefined) dbUpdates.maintenance_price_monthly = updates.maintenancePriceMonthly;
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
  if (updates.clientId !== undefined) dbUpdates.client_id = updates.clientId;

  const { error } = await supabase.from("projects").update(dbUpdates).eq("id", id);
  if (error) throw error;

  // If phases are included in updates, update them
  if (updates.phases) {
    for (const phase of updates.phases) {
      await supabase
        .from("project_phases")
        .update({ status: phase.status })
        .eq("id", phase.id);
    }
  }

  const project = await getProject(id);
  if (!project) throw new Error(`Project ${id} not found`);
  return project;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// === Tasks ===

export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapTask);
}

export async function getTask(id: string): Promise<Task | undefined> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapTask(data);
}

export async function addTask(task: Omit<Task, "id" | "createdAt">): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      id: `task_${Date.now()}`,
      project_id: task.projectId,
      client_id: task.clientId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      due_date: task.dueDate,
      estimated_minutes: task.estimatedMinutes,
      actual_minutes: task.actualMinutes,
      completed_at: task.completedAt,
      source: task.source,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTask(data);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.category !== undefined) dbUpdates.category = updates.category;
  if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
  if (updates.estimatedMinutes !== undefined) dbUpdates.estimated_minutes = updates.estimatedMinutes;
  if (updates.actualMinutes !== undefined) dbUpdates.actual_minutes = updates.actualMinutes;
  if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt;
  if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
  if (updates.clientId !== undefined) dbUpdates.client_id = updates.clientId;
  if (updates.source !== undefined) dbUpdates.source = updates.source;

  const { data, error } = await supabase
    .from("tasks")
    .update(dbUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapTask(data);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

// === Finances ===

export async function getFinances(): Promise<Finances> {
  const { data: revRows, error: rErr } = await supabase
    .from("revenue")
    .select("*")
    .order("date", { ascending: false });
  if (rErr) throw rErr;

  const { data: expRows, error: eErr } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });
  if (eErr) throw eErr;

  return {
    revenue: (revRows || []).map(mapRevenue),
    expenses: (expRows || []).map(mapExpense),
  };
}

export async function addRevenue(revenue: Omit<Revenue, "id">): Promise<void> {
  const { error } = await supabase.from("revenue").insert({
    id: `rev_${Date.now()}`,
    project_id: revenue.projectId,
    amount: revenue.amount,
    type: revenue.type,
    date: revenue.date,
    method: revenue.method,
  });
  if (error) throw error;
}

export async function addExpense(expense: Omit<Expense, "id">): Promise<void> {
  const { error } = await supabase.from("expenses").insert({
    id: `exp_${Date.now()}`,
    label: expense.label,
    amount: expense.amount,
    category: expense.category,
    date: expense.date,
    recurring: expense.recurring,
    recurring_frequency: expense.recurringFrequency || null,
  });
  if (error) throw error;
}

export async function deleteRevenue(id: string): Promise<void> {
  const { error } = await supabase.from("revenue").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}

// === Daily Log ===

export async function getDailyLogs(): Promise<DailyLog[]> {
  const { data, error } = await supabase
    .from("daily_log")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapDailyLog);
}

export async function getDailyLog(date: string): Promise<DailyLog | undefined> {
  const { data, error } = await supabase
    .from("daily_log")
    .select("*")
    .eq("date", date)
    .single();
  if (error) return undefined;
  return mapDailyLog(data);
}

export async function upsertDailyLog(log: DailyLog): Promise<void> {
  const { error } = await supabase.from("daily_log").upsert(
    {
      id: `log_${log.date.replace(/-/g, "")}`,
      date: log.date,
      morning_plan: log.morningPlan,
      evening_review: log.eveningReview,
      cowork_insights: log.coworkInsights,
    },
    { onConflict: "date" }
  );
  if (error) throw error;
}

// === Leads ===

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapLead);
}

export async function getLead(id: string): Promise<Lead | undefined> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return undefined;
  return mapLead(data);
}

export async function addLead(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      id: `lead_${Date.now()}`,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      last_contact_date: lead.lastContactDate,
      next_follow_up_date: lead.nextFollowUpDate,
      notes: lead.notes,
      estimated_value: lead.estimatedValue,
      tags: lead.tags,
    })
    .select()
    .single();
  if (error) throw error;
  return mapLead(data);
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.source !== undefined) dbUpdates.source = updates.source;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.lastContactDate !== undefined) dbUpdates.last_contact_date = updates.lastContactDate;
  if (updates.nextFollowUpDate !== undefined) dbUpdates.next_follow_up_date = updates.nextFollowUpDate;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.estimatedValue !== undefined) dbUpdates.estimated_value = updates.estimatedValue;
  if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

  const { error } = await supabase.from("leads").update(dbUpdates).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

// === Config ===

export async function getConfig(): Promise<Config> {
  const { data, error } = await supabase.from("config").select("*");
  if (error) throw error;

  const config: Record<string, unknown> = {};
  for (const row of data || []) {
    config[row.key] = row.value;
  }

  return {
    owner: config.owner as Config["owner"],
    goals: config.goals as Config["goals"],
    workHours: config.workHours as Config["workHours"],
  };
}

export async function updateConfig(updates: Partial<Config>): Promise<Config> {
  if (updates.owner) {
    await supabase.from("config").update({ value: updates.owner }).eq("key", "owner");
  }
  if (updates.goals) {
    await supabase.from("config").update({ value: updates.goals }).eq("key", "goals");
  }
  if (updates.workHours) {
    await supabase.from("config").update({ value: updates.workHours }).eq("key", "workHours");
  }
  return getConfig();
}
