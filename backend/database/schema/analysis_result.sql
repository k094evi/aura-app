-- database/schema/analysis_results.sql
-- Stores the full analysis output for one resume submission.
-- One row per resume analysis run.

CREATE TABLE IF NOT EXISTS analysis_results (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id   UUID REFERENCES resumes(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,

    -- ATS score (overall + per dimension)
    ats_score           INTEGER CHECK (ats_score BETWEEN 0 AND 100),
    keyword_score       INTEGER,
    formatting_score    INTEGER,
    experience_score    INTEGER,
    skills_score        INTEGER,
    grammar_score       INTEGER,

    -- Extracted skills (output of keyword_extractor.py)
    extracted_skills    TEXT[],

    -- Skill gaps (JSON array of {skill, missing, recommendation})
    skill_gaps          JSONB,

    -- Strengths and suggestions (string arrays)
    strengths           TEXT[],
    improvements        TEXT[],

    -- Grammar issues (JSON array of {type, text})
    grammar_issues      JSONB,

    -- Company matches (JSON array matching CompanyMatch schema)
    company_matches     JSONB,

    -- Detected role (heuristic from resume text)
    detected_role       TEXT,

    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_results_resume_id ON analysis_results(resume_id);
CREATE INDEX IF NOT EXISTS idx_results_user_id   ON analysis_results(user_id);