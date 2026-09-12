-- database/schema/002_security_hardening.sql
--
-- Run this once in the Supabase SQL Editor, top to bottom, against the
-- project where `users`, `resumes`, and `analysis_results` already exist
-- (from user.sql / resume.sql / analysis_result.sql).
--
-- Fixes two problems found during backend integration:
--
--   1. public.users.id was DEFAULT gen_random_uuid() — unrelated to the
--      IDs Supabase Auth actually assigns in auth.users. Nothing ever
--      inserted into public.users, so resumes.user_id / analysis_results.user_id
--      (both FK'd to users.id) would reject every insert with a real,
--      authenticated user_id as a foreign-key violation.
--
--   2. Row Level Security was never enabled on users / resumes /
--      analysis_results. Tables created via raw CREATE TABLE in Supabase
--      do NOT get RLS on by default. Since the frontend's publishable
--      (anon) key is public, this meant anyone could read every row in
--      these tables directly via the REST API, bypassing the ownership
--      check that only exists in app/api/routes/resumes.py's Python code.
--
-- Nothing here affects the backend's supabase_admin (service-role) client
-- — service-role always bypasses RLS, so existing writes from
-- analyze_controller.py keep working unchanged.


-- ============================================================================
-- STEP 1: Re-point public.users.id at auth.users.id
-- ============================================================================
-- public.users is currently empty (nothing ever wrote to it), so this is
-- safe to run as a drop/recreate rather than a data migration. If you have
-- since put real rows in there manually, tell me and we'll do this as an
-- ALTER + backfill instead.

DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       TEXT UNIQUE NOT NULL,
    full_name   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CASCADE above dropped resumes/analysis_results' FK constraints along
-- with the old users table (they referenced users.id). Recreate them so
-- both tables point at the new public.users:

ALTER TABLE public.resumes
    ADD CONSTRAINT resumes_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.analysis_results
    ADD CONSTRAINT analysis_results_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE public.analysis_results
    ADD CONSTRAINT analysis_results_resume_id_fkey
    FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE;


-- ============================================================================
-- STEP 2: Auto-create/sync a public.users row whenever someone signs up
-- ============================================================================
-- This is what makes Step 1 actually work going forward: every time
-- Supabase Auth creates a row in auth.users (i.e. sign_up()), this trigger
-- mirrors it into public.users automatically. auth_service.py doesn't need
-- to change — it never has to write to public.users itself.

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'full_name'
    )
    ON CONFLICT (id) DO UPDATE
        SET email     = EXCLUDED.email,
            full_name = COALESCE(EXCLUDED.full_name, public.users.full_name);
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Backfill: mirror any accounts that already exist in auth.users (e.g. if
-- you signed up while testing, before this trigger existed) into
-- public.users right now, so their resumes/analysis inserts stop failing
-- immediately after this migration runs.
INSERT INTO public.users (id, email, full_name)
SELECT id, email, raw_user_meta_data ->> 'full_name'
FROM auth.users
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- STEP 3: Enable Row Level Security + owner-only policies
-- ============================================================================

ALTER TABLE public.users            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- users: a person can read/update only their own profile row. No INSERT
-- policy is needed for regular users — rows are created solely by the
-- SECURITY DEFINER trigger above, not by client requests.
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- resumes: owner-only for every operation. Note the backend currently
-- writes resumes via supabase_admin (service role), which bypasses RLS
-- entirely — these policies govern what the anon/publishable key (i.e.
-- direct-from-browser access) is allowed to do.
CREATE POLICY "resumes_select_own" ON public.resumes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "resumes_insert_own" ON public.resumes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "resumes_update_own" ON public.resumes
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "resumes_delete_own" ON public.resumes
    FOR DELETE USING (auth.uid() = user_id);

-- analysis_results: same owner-only pattern.
CREATE POLICY "analysis_results_select_own" ON public.analysis_results
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "analysis_results_insert_own" ON public.analysis_results
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "analysis_results_update_own" ON public.analysis_results
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "analysis_results_delete_own" ON public.analysis_results
    FOR DELETE USING (auth.uid() = user_id);


-- ============================================================================
-- STEP 4: Housekeeping — auto-update resumes.updated_at on UPDATE
-- ============================================================================
-- resumes.updated_at exists in the schema but nothing currently sets it
-- when a row changes. Harmless to add now, before anything relies on it.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS resumes_set_updated_at ON public.resumes;
CREATE TRIGGER resumes_set_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================================
-- STEP 5: Make PostgREST pick all of this up immediately
-- ============================================================================
NOTIFY pgrst, 'reload schema';