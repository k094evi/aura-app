# app/services/auth_service.py
from app.extensions.supabase_client import supabase

def get_authenticated_user(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ', 1)[1]
    try:
        response = supabase.auth.get_user(token)
    except Exception:
        return None

    if response is None or response.user is None:
        return None

    return response.user