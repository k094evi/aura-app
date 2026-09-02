// features/resume-upload/services/getSupportedJobs.ts

// Fetch the job titles currently supported by AURA.
export async function getSupportedJobs(): Promise<string[]> {
  // Request the supported jobs from the Flask backend.
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_FLASK_API_URL}/api/jobs/supported`
  );

  // Stop if Flask fails to return a successful response.
  if (!res.ok) {
    throw new Error('Failed to load supported jobs');
  }

  // Convert Flask's JSON response into a JavaScript object.
  const data = await res.json();

  // Return only the jobs array needed by the frontend.
  return data.jobs;
}