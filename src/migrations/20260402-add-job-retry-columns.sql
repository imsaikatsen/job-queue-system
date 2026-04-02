-- Add retry support columns to jobs table
ALTER TABLE "job"
  ADD COLUMN IF NOT EXISTS "maxAttempts" integer NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS "nextRunAt" timestamptz DEFAULT NULL;
