
-- Drop existing tables if they exist (in correct order for FK)
DROP TABLE IF EXISTS daily_log CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS revenue CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_phases CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS config CASCADE;

-- TABLE : clients
CREATE TABLE clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  niche TEXT,
  source TEXT DEFAULT 'autre',
  status TEXT DEFAULT 'actif' CHECK (status IN ('actif', 'inactif', 'archivé')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : projects
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'à-faire' CHECK (status IN ('à-faire', 'en-cours', 'livré', 'maintenance', 'terminé')),
  priority TEXT DEFAULT 'moyenne' CHECK (priority IN ('haute', 'moyenne', 'basse')),
  price NUMERIC DEFAULT 0,
  paid_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'en-attente' CHECK (payment_status IN ('en-attente', 'acompte-reçu', 'payé', 'en-retard')),
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  maintenance_start_date DATE,
  maintenance_end_date DATE,
  maintenance_price_monthly NUMERIC DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : project_phases
CREATE TABLE project_phases (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'à-faire' CHECK (status IN ('à-faire', 'en-cours', 'terminé')),
  start_date DATE,
  end_date DATE,
  sort_order INTEGER DEFAULT 0
);

-- TABLE : tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'à-faire' CHECK (status IN ('à-faire', 'en-cours', 'terminé')),
  priority TEXT DEFAULT 'moyenne' CHECK (priority IN ('haute', 'moyenne', 'basse')),
  category TEXT DEFAULT 'dev' CHECK (category IN ('dev', 'design', 'client', 'admin', 'contenu', 'prospection', 'perso')),
  due_date DATE,
  estimated_minutes INTEGER,
  actual_minutes INTEGER,
  completed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'manuel' CHECK (source IN ('manuel', 'cowork', 'récurrent')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : leads
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT DEFAULT 'linkedin',
  status TEXT DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'premier-contact', 'call-planifié', 'proposition-envoyée', 'négociation', 'gagné', 'perdu', 'en-pause')),
  last_contact_date DATE,
  next_follow_up_date DATE,
  notes TEXT,
  estimated_value NUMERIC DEFAULT 4000,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : revenue
CREATE TABLE revenue (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  type TEXT DEFAULT 'paiement' CHECK (type IN ('acompte', 'paiement-final', 'maintenance', 'autre')),
  date DATE DEFAULT CURRENT_DATE,
  method TEXT DEFAULT 'virement',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : expenses
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  category TEXT DEFAULT 'outils' CHECK (category IN ('outils', 'formation', 'marketing', 'bureau', 'transport', 'nourriture', 'autre')),
  date DATE DEFAULT CURRENT_DATE,
  recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('mensuel', 'annuel', 'trimestriel')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : daily_log
CREATE TABLE daily_log (
  id TEXT PRIMARY KEY,
  date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  morning_plan JSONB DEFAULT '[]',
  evening_review JSONB,
  cowork_insights TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE : config
CREATE TABLE config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (since this is a personal app)
CREATE POLICY "Allow all" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON project_phases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON revenue FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON daily_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON config FOR ALL USING (true) WITH CHECK (true);
