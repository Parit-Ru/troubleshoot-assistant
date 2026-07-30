import { QueryClient } from "@tanstack/react-query";

/**
 * Single shared QueryClient instance for the whole app. `staleTime` of
 * 60s means fetched data is considered "fresh" for a minute before
 * TanStack Query will automatically refetch it in the background —
 * reasonable default for now, can be tuned per-query later once we
 * have real endpoints with known update frequency.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});