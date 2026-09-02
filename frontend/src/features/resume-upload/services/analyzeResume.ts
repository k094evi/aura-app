// features/resume-upload/services/analyzeResume.ts

import { createClient } from '@/lib/supabase/client';

// Send a request to Flask to analyze the selected resume.
export async function analyzeResume(resumeId: string) {
  // Create a Supabase client for the current browser session.
  const supabase = createClient();

  // Get the currently signed-in user's session.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Stop if the user is not authenticated.
  if (!session) {
    throw new Error('You must be signed in to analyze a resume.');
  }

  // Tell Flask to start analyzing this resume.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FLASK_API_URL}/api/resumes/${resumeId}/analyze`,
    {
      // The analyze endpoint expects a POST request.
      method: 'POST',

      // Send the Supabase access token so Flask can authenticate the user.
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  // Handle errors returned by the Flask API.
  if (!res.ok) {
    // Try to read Flask's JSON error response.
    const body = await res.json().catch(() => ({}));

    // Show Flask's error message or use a fallback message.
    throw new Error(body.error || 'Failed to analyze resume');
  }

  // Return Flask's successful JSON response to the frontend.
  return res.json();
}