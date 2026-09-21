// src/app/reset-password/page.tsx
//
// The route file stays in src/app (Next.js requires that); the actual page
// lives in src/features/signin-signup/components/ResetPassword.tsx.

import ResetPassword from '@/features/signin-signup/components/ResetPassword';

export default function Page() {
  return <ResetPassword />;
}