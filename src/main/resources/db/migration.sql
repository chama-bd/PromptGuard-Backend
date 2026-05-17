-- Migration automatique : ajoute les colonnes manquantes si elles n'existent pas

-- Colonne role dans employees (ajoutée après création initiale de la table)
ALTER TABLE employees ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER';
