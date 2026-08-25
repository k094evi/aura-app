-- database/schema/resumes.sql
-- Stores uploaded resume files and their parsed text output.

CREATE TABLE IF NOT EXISTS resumes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,

    -- File metadata
    filename        TEXT NOT NULL,
    file_type       TEXT NOT NULL CHECK (file_type IN ('pdf', 'docx', 'doc')),
    file_size_kb    NUMERIC(10, 2),

    -- Parsed text sections (output of resume_parser.py)
    raw_text            TEXT,
    contact_block       TEXT,
    summary_block       TEXT,
    experience_block    TEXT,
    education_block     TEXT,
    skills_block        TEXT,
    projects_block      TEXT,
    certifications_block TEXT,
    other_block         TEXT,

    -- Parse stats
    word_count      INTEGER,
    char_count      INTEGER,
    section_count   INTEGER,

    -- Target context (supplied by user on upload)
    target_job          TEXT,
    target_companies    TEXT[],     -- array of company name strings

    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON resumes(created_at DESC);