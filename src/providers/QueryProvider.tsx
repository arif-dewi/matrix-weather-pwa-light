// src/providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { env } from '@/config/env';
import { logger } from '@/services/MatrixLogger';

// Default query client configuration
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        retry: (failureCount: number, error: unknown) => {
          // Don't retry on 4xx errors except 408 (timeout) and 429 (rate limit)
          if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('401') || message.includes('403') || message.includes('404')) {
              logger.warn(`Query not retrying due to client error: ${error.message}`);
              return false;
            }
          }

          if (failureCount >= 3) {
            logger.error(`Query failed after ${failureCount} attempts`, error);
            return false;
          }

          logger.debug(`Query retry attempt ${failureCount + 1}`, error);
          return true;
        },
        retryDelay: (attemptIndex: number) => {
          const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
          logger.debug(`Query retry delay: ${delay}ms`);
          return delay;
        },
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        networkMode: 'online',
      },
      mutations: {
        retry: 1,
        networkMode: 'online',
        onError: (error: unknown) => {
          logger.error('Mutation failed', error);
        },
        onSuccess: (data: unknown, variables: unknown) => {
          logger.debug('Mutation succeeded', { data, variables });
        },
      },
    },
  });
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance only once
  const [queryClient] = useState(() => {
    const client = createQueryClient();

    // Log query client creation in development
    if (env.isDevelopment) {
      logger.info('🔧 TanStack Query Client initialized');

      // Add global listeners for debugging
      client.getQueryCache().subscribe((event) => {
        if (event.type === 'added') {
          logger.debug(`Query added: ${JSON.stringify(event.query.queryKey)}`);
        } else if (event.type === 'removed') {
          logger.debug(`Query removed: ${JSON.stringify(event.query.queryKey)}`);
        } else if (event.type === 'updated') {
          const { query } = event;
          if (query.state.error) {
            logger.warn(`Query error: ${JSON.stringify(query.queryKey)}`, query.state.error);
          } else if (query.state.data) {
            logger.debug(`Query updated: ${JSON.stringify(query.queryKey)}`);
          }
        }
      });

      client.getMutationCache().subscribe((event) => {
        if (event.type === 'added') {
          logger.debug('Mutation added');
        } else if (event.type === 'updated') {
          const { mutation } = event;
          if (mutation.state.error) {
            logger.warn('Mutation error', mutation.state.error);
          } else if (mutation.state.data) {
            logger.debug('Mutation succeeded');
          }
        }
      });
    }

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {env.isDevelopment && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
          position="bottom"
        />
      )}
    </QueryClientProvider>
  );
}

// Export query client for external use if needed
export const getQueryClient = () => createQueryClient();
