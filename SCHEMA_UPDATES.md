-- SQL Migration for Skill Vector Feature

-- 1. Enable pgvector extension (if available)
-- Note: This requires superuser privileges on some Supabase projects
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add skill_vector column to users table
-- We use 1536 as the standard dimension for text-embedding-3-small (OpenAI)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS skill_vector vector(1536);

-- 3. Trigger or Helper function suggestion
-- You can use an Edge Function to populate this column whenever a user updates their skills.
-- Example workflow:
-- User updates skills -> Trigger Auth Hook -> Call OpenAI Embeddings API -> Update skill_vector column.
