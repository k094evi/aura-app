// features/resume-upload/services/uploadResume.ts
import { createClient } from '@/lib/supabase/client';

// Define the information required to upload a resume.
interface UploadResumeParams {
  // The resume file selected by the user.
  file: File;

  // The job the user wants their resume analyzed for.
  targetJob: string;

  // Companies the user wants to include in the analysis.
  selectedCompanies: string[];
}

// Upload the resume file and create its database record.
export async function uploadResume({
  file,
  targetJob,
  selectedCompanies,
}: UploadResumeParams) {
  // Create the Supabase client for the current user.
  const supabase = createClient();

  // Get the currently signed-in user.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  // Prevent unauthenticated users from uploading resumes.
  if (userError || !user) {
    throw new Error('You must be signed in to upload a resume.');
  }

  // Get the file extension from the original filename.
  const fileExt = file.name.split('.').pop();

  // Create a unique storage path inside the user's folder.
  const storagePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

  // Upload the actual resume file to Supabase Storage.
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(storagePath, file);

  // Stop if the file upload fails.
  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Create a database record for the uploaded resume.
  const { data: resumeRow, error: insertError } = await supabase
    .from('resumes')
    .insert({
      // Associate the resume with the authenticated user.
      user_id: user.id,

      // Store the location of the file in Supabase Storage.
      storage_path: storagePath,

      // Keep the original filename for display purposes.
      original_filename: file.name,

      // Save the file size for validation and reporting.
      file_size: file.size,

      // Save the user's selected target job.
      target_job: targetJob,

      // Save the companies selected by the user.
      selected_companies: selectedCompanies,

      // Mark the resume as uploaded before analysis begins.
      status: 'uploaded',
    })
    .select()
    .single();

  // Remove the uploaded file if its database record could not be created.
  if (insertError) {
    await supabase.storage.from('resumes').remove([storagePath]);

    throw new Error(
      `Failed to save resume record: ${insertError.message}`
    );
  }

  // Return the newly created resume record.
  return resumeRow;
}