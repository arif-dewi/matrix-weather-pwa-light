import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { QUERY_CONFIG } from "@/constants/weather.ts";
import { env } from '@/config/env';

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: QUERY_CONFIG.STALE_TIME.WEATHER,
      retry: QUERY_CONFIG.RETRY.ATTEMPTS,
    },
    mutations: {
      retry: QUERY_CONFIG.MUTATIONS.RETRY,
    },
  },
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient(queryClientOptions));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {env.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}