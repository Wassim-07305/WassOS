import fs from "fs";
import path from "path";
import type {
  Client,
  Project,
  Task,
  Finances,
  DailyLog,
  Lead,
  Config,
} from "@/types";

const dataDir = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// === Clients ===
export function getClients(): Client[] {
  return readJson<Client[]>("clients.json");
}

export function getClient(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function addClient(client: Omit<Client, "id" | "createdAt">): Client {
  const clients = getClients();
  const newClient: Client = {
    ...client,
    id: `client_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  writeJson("clients.json", clients);
  return newClient;
}

export function updateClient(id: string, updates: Partial<Client>): Client {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index === -1) throw new Error(`Client ${id} not found`);
  clients[index] = { ...clients[index], ...updates };
  writeJson("clients.json", clients);
  return clients[index];
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  writeJson("clients.json", clients);
}

// === Projects ===
export function getProjects(): Project[] {
  return readJson<Project[]>("projects.json");
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function addProject(project: Omit<Project, "id" | "createdAt">): Project {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: `proj_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  writeJson("projects.json", projects);
  return newProject;
}

export function updateProject(id: string, updates: Partial<Project>): Project {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) throw new Error(`Project ${id} not found`);
  projects[index] = { ...projects[index], ...updates };
  writeJson("projects.json", projects);
  return projects[index];
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  writeJson("projects.json", projects);
}

// === Tasks ===
export function getTasks(): Task[] {
  return readJson<Task[]>("tasks.json");
}

export function getTask(id: string): Task | undefined {
  return getTasks().find((t) => t.id === id);
}

export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: `task_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  writeJson("tasks.json", tasks);
  return newTask;
}

export function updateTask(id: string, updates: Partial<Task>): Task {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Task ${id} not found`);
  tasks[index] = { ...tasks[index], ...updates };
  writeJson("tasks.json", tasks);
  return tasks[index];
}

export function deleteTask(id: string): void {
  const tasks = getTasks().filter((t) => t.id !== id);
  writeJson("tasks.json", tasks);
}

// === Finances ===
export function getFinances(): Finances {
  return readJson<Finances>("finances.json");
}

export function addRevenue(revenue: Omit<Finances["revenue"][0], "id">): void {
  const finances = getFinances();
  finances.revenue.push({ ...revenue, id: `rev_${Date.now()}` });
  writeJson("finances.json", finances);
}

export function addExpense(expense: Omit<Finances["expenses"][0], "id">): void {
  const finances = getFinances();
  finances.expenses.push({ ...expense, id: `exp_${Date.now()}` });
  writeJson("finances.json", finances);
}

export function deleteRevenue(id: string): void {
  const finances = getFinances();
  finances.revenue = finances.revenue.filter((r) => r.id !== id);
  writeJson("finances.json", finances);
}

export function deleteExpense(id: string): void {
  const finances = getFinances();
  finances.expenses = finances.expenses.filter((e) => e.id !== id);
  writeJson("finances.json", finances);
}

// === Daily Log ===
export function getDailyLogs(): DailyLog[] {
  return readJson<DailyLog[]>("daily-log.json");
}

export function getDailyLog(date: string): DailyLog | undefined {
  return getDailyLogs().find((d) => d.date === date);
}

export function upsertDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  const index = logs.findIndex((d) => d.date === log.date);
  if (index >= 0) {
    logs[index] = log;
  } else {
    logs.unshift(log);
  }
  writeJson("daily-log.json", logs);
}

// === Leads ===
export function getLeads(): Lead[] {
  return readJson<Lead[]>("contacts.json");
}

export function getLead(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id);
}

export function addLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
  const leads = getLeads();
  const newLead: Lead = {
    ...lead,
    id: `lead_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  writeJson("contacts.json", leads);
  return newLead;
}

export function updateLead(id: string, updates: Partial<Lead>): void {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) throw new Error(`Lead ${id} not found`);
  leads[index] = { ...leads[index], ...updates };
  writeJson("contacts.json", leads);
}

export function deleteLead(id: string): void {
  const leads = getLeads().filter((l) => l.id !== id);
  writeJson("contacts.json", leads);
}

// === Config ===
export function getConfig(): Config {
  return readJson<Config>("config.json");
}

export function updateConfig(updates: Partial<Config>): Config {
  const config = getConfig();
  const updated = { ...config, ...updates };
  writeJson("config.json", updated);
  return updated;
}
