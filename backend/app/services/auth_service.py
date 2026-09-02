# app/services/auth_service.py

from app.extensions.supabase_client import supabase


def get_authenticated_user(request):
    # Read the authentication token sent by the frontend.
    auth_header = request.headers.get("Authorization", "")

    # Reject requests that do not use the expected Bearer token format.
    if not auth_header.startswith("Bearer "):
        return None

    # Extract the actual access token from the Authorization header.
    token = auth_header.split(" ", 1)[1]

    # Ask Supabase to verify the user's access token.
    try:
        response = supabase.auth.get_user(token)

    # Treat authentication errors as an unauthenticated request.
    except Exception:
        return None

    # Reject the request if Supabase could not identify a user.
    if response is None or response.user is None:
        return None

    # Return the authenticated Supabase user.
    return response.user