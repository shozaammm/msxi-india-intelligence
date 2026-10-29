import { QueryClient } from '@tanstack/react-query'

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        retry: 2,
        retryDelay: 1000,
      },
    },
  })
}

let browserClient: QueryClient | undefined
export function getQueryClient() {
  if (typeof window === 'undefined') return makeQueryClient()
  if (!browserClient) browserClient = makeQueryClient()
  return browserClient
}
