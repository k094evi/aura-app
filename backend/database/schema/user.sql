-- database/schema/users.sql

CREATE TABLE IF NOT EXISTS users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    full_name   TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);