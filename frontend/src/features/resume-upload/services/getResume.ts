// features/resume-upload/services/getResume.ts

import { createClient } from '@/lib/supabase/client';
import { resumeSchema } from '@/schemas/resume';

// Fetch one resume from Supabase using its ID.
export async function getResume(resumeId: string) {
  // Create the Supabase client for this request.
  const supabase = createClient();

  // Find the resume record that matches the provided ID.
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single();

  // Stop and show the database error if the query fails.
  if (error) {
    throw new Error(error.message);
  }

  // Validate the database result before returning it.
  return resumeSchema.parse(data);
}