# extensions/supabase_client.py
import os
from supabase import create_client

supabase = create_client(
    os.environ["SUPABASE_URL"],
    os.environ["SUPABASE_KEY"],  # service role — this is backend-only, never frontend
)
