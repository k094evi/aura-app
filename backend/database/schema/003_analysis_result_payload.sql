-- database/schema/003_analysis_result_payload.sql
--
-- Run once in the Supabase SQL Editor (after 002_security_hardening.sql).
--
-- Resume History ("View Results") needs to re-open a past analysis exactly
-- as the dashboard showed it. analysis_results only stored part of the
-- response (no top_jobs, total_jobs, certifications, skill_gap_source), so
-- we keep the complete /api/analyze JSON payload in one JSONB column.
--
-- Older rows (created before this migration) have result_json = NULL; the
-- history detail endpoint rebuilds a partial result for them from the
-- existing columns.

ALTER TABLE public.analysis_results
    ADD COLUMN IF NOT EXISTS result_json JSONB;

-- Resume History lists one user's analyses newest-first.
CREATE INDEX IF NOT EXISTS idx_results_user_created
    ON public.analysis_results (user_id, created_at DESC);

NOTIFY pgrst, 'reload schema';
