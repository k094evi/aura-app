from app.extensions.supabase_client import supabase

storage_path = "2fa9a092-08ff-4810-b556-abf085384299/c73d4179-584d-4755-a360-f01441adf8b9.pdf"

try:
    file_bytes = supabase.storage.from_("resumes").download(storage_path)

    print("SUCCESS")
    print(f"Downloaded {len(file_bytes)} bytes")

except Exception as e:
    print("FAILED")
    print(e)