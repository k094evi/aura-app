'use client';

// Provides React Query functionality to the Next.js application.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';

// Makes one React Query client available to all child components.
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create the QueryClient only once when the provider is mounted.
  const [queryClient] = useState(() => new QueryClient());

  // Give all child components access to React Query.
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}