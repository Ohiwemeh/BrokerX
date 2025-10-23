import { QueryClient } from '@tanstack/react-query';

// Create a client with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data is fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes - cache garbage collection time (formerly cacheTime)
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on reconnect
      refetchOnMount: true, // Refetch on component mount
    },
    mutations: {
      retry: 0, // Don't retry mutations
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
