# FILE LOCATION: app/config.py
import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

# ── Bulletproof Path Resolution ───────────────────────────────────────
# This ensures Python grabs your project's absolute folder structure 
# instead of relying on where you typed 'uvicorn' in your console.
CURRENT_DIR = Path(__file__).resolve().parent  # points to app/
BACKEND_DIR = CURRENT_DIR.parent               # points to backend/
ENV_PATH = BACKEND_DIR / ".env"

# Debugging assistant: This will print exactly where your app is looking 
# for your environment variables right in your terminal console.
print(f"--> Pydantic is looking for your .env file at: {ENV_PATH.resolve()}")
print(f"--> Does the file exist there? {ENV_PATH.exists()}")

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # ── App ───────────────────────────────────────────────────────────────
    APP_NAME: str = "Aura Resume Analyzer"
    DEBUG: bool = False

    # ── CORS ──────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://vercel.app",
    ]

    # ── Supabase (PostgreSQL) ─────────────────────────────────────────────
    SUPABASE_URL: str
    SUPABASE_PUBLISHABLE_KEY: str
    SUPABASE_SECRET_KEY: str
    SUPABASE_JWKS_URL: str = ""     
    DATABASE_URL: str = ""          

    # ── JWT ───────────────────────────────────────────────────────────────
    JWT_SECRET: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24   

    # ── File upload ───────────────────────────────────────────────────────
    MAX_UPLOAD_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx", ".doc"]


# Single shared settings instance
settings = Settings()  # pyright: ignore[reportCallIssue]  # Values come from BaseSettings sources at runtime.