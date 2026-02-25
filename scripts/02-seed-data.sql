
-- Clients
INSERT INTO clients (id, name, email, phone, company, niche, source, status, notes) VALUES
  ('client_001', 'Steven Boss', 'steven@bosscoaching.com', '+33 6 12 34 56 78', 'Boss Coaching', 'Business coaching', 'LinkedIn', 'actif', 'Très réactif, préfère les calls le matin. Gère une communauté de 500+ entrepreneurs.'),
  ('client_002', 'Damien Reynaud', 'damien@reynaudformation.fr', '+33 6 23 45 67 89', 'Reynaud Formation', 'Formation en ligne', 'Recommandation', 'actif', 'A besoin de vidéos Loom pour chaque livraison. Très orienté détails.'),
  ('client_003', 'Alexis Alanu', 'alexis@alanuconsulting.com', '+33 6 34 56 78 90', 'Alanu Consulting', 'Consulting stratégique', 'LinkedIn', 'actif', 'Nouveau client, très motivé. Veut lancer son app le plus vite possible.'),
  ('client_004', 'Timothée Fortin', 'timothee@fortinfitness.com', '+33 6 45 67 89 01', 'Fortin Fitness', 'Fitness coaching', 'Instagram', 'actif', 'App livrée, en phase de maintenance. Très content du résultat, bon potentiel de referral.'),
  ('client_005', 'Mathieu Durand', 'mathieu@durandcoaching.fr', '+33 6 56 78 90 12', 'Durand Business Coaching', 'Business coaching', 'Bouche à oreille', 'actif', 'Projet en phase de livraison. A une grosse audience sur YouTube (50k abonnés).');

-- Projects
INSERT INTO projects (id, client_id, name, description, status, priority, price, paid_amount, payment_status, start_date, estimated_end_date, actual_end_date, maintenance_start_date, maintenance_end_date, maintenance_price_monthly, tags) VALUES
  ('proj_001', 'client_001', 'App Boss Coaching', 'Application mobile de suivi coaching avec programmes personnalisés et messagerie intégrée', 'en-cours', 'haute', 4000, 2000, 'acompte-reçu', '2025-02-01', '2025-03-01', NULL, NULL, NULL, 200, ARRAY['coaching', 'mobile', 'ESA']),
  ('proj_002', 'client_002', 'App Reynaud Formation', 'Application de formation en ligne avec vidéos, quiz et certificats', 'en-cours', 'haute', 4000, 2000, 'acompte-reçu', '2025-02-10', '2025-03-10', NULL, NULL, NULL, 200, ARRAY['formation', 'e-learning', 'ESA']),
  ('proj_003', 'client_003', 'App Alanu Consulting', 'Application de consulting avec booking de sessions et suivi client', 'à-faire', 'moyenne', 4000, 0, 'en-attente', '2025-03-01', '2025-03-29', NULL, NULL, NULL, 200, ARRAY['consulting', 'booking', 'ESA']),
  ('proj_004', 'client_004', 'App Fortin Fitness', 'Application de suivi fitness avec programmes d''entraînement et nutrition', 'maintenance', 'basse', 4000, 4000, 'payé', '2024-11-15', '2024-12-15', '2024-12-12', '2025-01-01', '2025-06-30', 200, ARRAY['fitness', 'nutrition', 'ESA']),
  ('proj_005', 'client_005', 'App Durand Coaching', 'Application de business coaching avec mastermind groups et contenu exclusif', 'en-cours', 'haute', 4000, 4000, 'payé', '2025-01-20', '2025-02-17', NULL, NULL, NULL, 200, ARRAY['coaching', 'mastermind', 'ESA']);

-- Project phases
INSERT INTO project_phases (id, project_id, name, status, start_date, end_date, sort_order) VALUES
  ('phase_001', 'proj_001', 'Extraction', 'terminé', '2025-02-01', '2025-02-07', 1),
  ('phase_002', 'proj_001', 'Structuration', 'terminé', '2025-02-08', '2025-02-14', 2),
  ('phase_003', 'proj_001', 'Développement App', 'en-cours', '2025-02-15', '2025-02-25', 3),
  ('phase_004', 'proj_001', 'Livraison & Feedback', 'à-faire', '2025-02-26', '2025-03-01', 4),
  ('phase_005', 'proj_002', 'Extraction', 'terminé', '2025-02-10', '2025-02-16', 1),
  ('phase_006', 'proj_002', 'Structuration', 'en-cours', '2025-02-17', '2025-02-23', 2),
  ('phase_007', 'proj_002', 'Développement App', 'à-faire', '2025-02-24', '2025-03-05', 3),
  ('phase_008', 'proj_002', 'Livraison & Feedback', 'à-faire', '2025-03-06', '2025-03-10', 4),
  ('phase_009', 'proj_003', 'Extraction', 'à-faire', '2025-03-01', '2025-03-07', 1),
  ('phase_010', 'proj_003', 'Structuration', 'à-faire', '2025-03-08', '2025-03-14', 2),
  ('phase_011', 'proj_003', 'Développement App', 'à-faire', '2025-03-15', '2025-03-25', 3),
  ('phase_012', 'proj_003', 'Livraison & Feedback', 'à-faire', '2025-03-26', '2025-03-29', 4),
  ('phase_013', 'proj_004', 'Extraction', 'terminé', '2024-11-15', '2024-11-21', 1),
  ('phase_014', 'proj_004', 'Structuration', 'terminé', '2024-11-22', '2024-11-28', 2),
  ('phase_015', 'proj_004', 'Développement App', 'terminé', '2024-11-29', '2024-12-09', 3),
  ('phase_016', 'proj_004', 'Livraison & Feedback', 'terminé', '2024-12-10', '2024-12-12', 4),
  ('phase_017', 'proj_005', 'Extraction', 'terminé', '2025-01-20', '2025-01-26', 1),
  ('phase_018', 'proj_005', 'Structuration', 'terminé', '2025-01-27', '2025-02-02', 2),
  ('phase_019', 'proj_005', 'Développement App', 'terminé', '2025-02-03', '2025-02-13', 3),
  ('phase_020', 'proj_005', 'Livraison & Feedback', 'en-cours', '2025-02-14', '2025-02-17', 4);

-- Tasks
INSERT INTO tasks (id, project_id, client_id, title, description, status, priority, category, due_date, estimated_minutes, source) VALUES
  ('task_001', 'proj_001', 'client_001', 'Créer les écrans d''onboarding', '3 écrans de bienvenue + écran de connexion', 'en-cours', 'haute', 'dev', '2025-02-25', 120, 'manuel'),
  ('task_002', 'proj_001', 'client_001', 'Intégrer la messagerie in-app', 'Chat en temps réel entre coach et clients', 'à-faire', 'haute', 'dev', '2025-02-27', 240, 'manuel'),
  ('task_003', 'proj_002', 'client_002', 'Structurer les modules de formation', 'Organiser le contenu en modules et leçons avec Damien', 'en-cours', 'haute', 'client', '2025-02-23', 90, 'manuel'),
  ('task_004', 'proj_002', 'client_002', 'Tourner vidéo Loom structuration', 'Vidéo explicative de la phase de structuration pour Damien', 'à-faire', 'moyenne', 'contenu', '2025-02-26', 45, 'manuel'),
  ('task_005', 'proj_005', 'client_005', 'Préparer la livraison app Mathieu', 'Tests finaux + vidéo de démo + docs pour Mathieu', 'en-cours', 'haute', 'dev', '2025-02-25', 180, 'manuel'),
  ('task_006', NULL, NULL, 'Prospection LinkedIn - 20 messages', 'Envoyer 20 messages personnalisés à des coaches sur LinkedIn', 'à-faire', 'moyenne', 'prospection', '2025-02-25', 60, 'récurrent'),
  ('task_007', NULL, NULL, 'Créer un post LinkedIn', 'Post sur la méthode ESA et comment elle aide les coaches', 'à-faire', 'moyenne', 'contenu', '2025-02-26', 30, 'manuel'),
  ('task_008', 'proj_004', 'client_004', 'Bug fix - notifications push', 'Les notifications push ne s''affichent pas sur Android', 'à-faire', 'moyenne', 'dev', '2025-02-28', 60, 'manuel'),
  ('task_009', NULL, NULL, 'Facturation mensuelle maintenances', 'Envoyer les factures de maintenance pour février', 'à-faire', 'haute', 'admin', '2025-02-28', 30, 'récurrent'),
  ('task_010', 'proj_003', 'client_003', 'Call découverte avec Alexis', 'Premier call pour comprendre les besoins et lancer l''extraction', 'à-faire', 'haute', 'client', '2025-02-27', 60, 'manuel'),
  ('task_011', NULL, NULL, 'Analyser les métriques de la semaine', 'Revoir les KPIs : CA, nombre de leads, taux de conversion', 'à-faire', 'basse', 'admin', '2025-02-28', 30, 'cowork');

-- Leads
INSERT INTO leads (id, name, email, phone, source, status, last_contact_date, next_follow_up_date, notes, estimated_value, tags) VALUES
  ('lead_001', 'Jean-Pierre Martin', 'jp.martin@coachpro.fr', NULL, 'LinkedIn', 'premier-contact', '2025-02-20', '2025-02-27', 'Coach business avec 200 clients actifs. Intéressé par une app pour gérer ses programmes. Budget ok.', 4000, ARRAY['coach', 'chaud']),
  ('lead_002', 'Sophie Leclerc', 'sophie@leclerc-coaching.com', '+33 6 98 76 54 32', 'Instagram', 'call-planifié', '2025-02-22', '2025-02-26', 'Coach en développement personnel, 15k followers Instagram. Call prévu mercredi 26 à 14h.', 4000, ARRAY['coach', 'chaud', 'instagram']),
  ('lead_003', 'Marc Dubois', 'marc@dubois-consulting.fr', NULL, 'LinkedIn', 'proposition-envoyée', '2025-02-18', '2025-02-25', 'Consultant en management. Proposition envoyée à 4500€ (app + formation). Attend retour.', 4500, ARRAY['consultant', 'tiède']),
  ('lead_004', 'Émilie Rousseau', 'emilie@rousseau-yoga.fr', '+33 6 11 22 33 44', 'Bouche à oreille', 'nouveau', NULL, '2025-02-26', 'Prof de yoga recommandée par Timothée Fortin. 300 élèves, cherche une app de booking.', 4000, ARRAY['yoga', 'referral', 'chaud']);

-- Revenue
INSERT INTO revenue (id, project_id, amount, type, date, method) VALUES
  ('rev_001', 'proj_001', 2000, 'acompte', '2025-02-01', 'virement'),
  ('rev_002', 'proj_002', 2000, 'acompte', '2025-02-10', 'virement'),
  ('rev_003', 'proj_005', 2000, 'acompte', '2025-01-20', 'virement'),
  ('rev_004', 'proj_005', 2000, 'paiement-final', '2025-02-14', 'virement'),
  ('rev_005', 'proj_004', 200, 'maintenance', '2025-02-01', 'virement'),
  ('rev_006', 'proj_004', 200, 'maintenance', '2025-01-01', 'virement'),
  ('rev_007', 'proj_004', 2000, 'acompte', '2024-11-15', 'virement'),
  ('rev_008', 'proj_004', 2000, 'paiement-final', '2024-12-12', 'virement');

-- Expenses
INSERT INTO expenses (id, label, amount, category, date, recurring, recurring_frequency) VALUES
  ('exp_001', 'Abonnement Claude Max', 180, 'outils', '2025-02-01', true, 'mensuel'),
  ('exp_002', 'Abonnement Cursor Pro', 20, 'outils', '2025-02-01', true, 'mensuel'),
  ('exp_003', 'Abonnement Figma', 12, 'outils', '2025-02-01', true, 'mensuel'),
  ('exp_004', 'Abonnement Expo / EAS', 29, 'outils', '2025-02-01', true, 'mensuel'),
  ('exp_005', 'Coworking Marseille', 200, 'bureau', '2025-02-01', true, 'mensuel'),
  ('exp_006', 'Formation React Native avancé', 150, 'formation', '2025-02-15', false, NULL);

-- Daily log
INSERT INTO daily_log (id, date, morning_plan, evening_review, cowork_insights) VALUES
  ('log_001', '2025-02-25', '["9h-10h : Call client Steven Boss — point dev app", "10h-12h : Dev écrans onboarding App Boss Coaching", "14h-15h30 : Structuration modules avec Damien Reynaud", "15h30-16h30 : Préparer livraison App Durand Coaching", "16h30-17h30 : Prospection LinkedIn (20 messages)", "17h30-18h : Review journée + planning demain"]', NULL, NULL),
  ('log_002', '2025-02-24', '["9h-10h : Review code App Boss Coaching", "10h-12h30 : Dev système de programmes coaching", "14h-16h : Dev App Boss Coaching — écrans profil", "16h-17h : Rédiger post LinkedIn méthode ESA", "17h-18h : Prospection LinkedIn (20 messages)"]', '{"completed": ["Review code", "Dev programmes coaching", "Dev écrans profil"], "notCompleted": ["Post LinkedIn", "Prospection LinkedIn"], "blockers": "Le dev a pris plus de temps que prévu, pas eu le temps pour le contenu et la prospection", "mood": 6, "lessonsLearned": "Mettre la prospection et le contenu en premier le matin quand l''énergie est là"}', 'Tu as tendance à repousser la prospection. Essaie de la placer en premier créneau demain matin. La prospection nourrit le pipeline et c''est ce qui fait tourner le business.');

-- Config
INSERT INTO config (key, value) VALUES
  ('owner', '{"name": "Wass", "business": "Développeur d''applications pour coaches", "method": "ESA (Extract, Structure, App)", "basePrice": 4000, "deliveryWeeks": 4, "location": "Marseille"}'),
  ('goals', '{"monthlyRevenueTarget": 10000, "weeklyProspectingMessages": 100, "weeklyContentPieces": 3, "maxActiveProjects": 5}'),
  ('workHours', '{"start": "09:00", "end": "18:00", "breakStart": "12:30", "breakEnd": "14:00"}');
