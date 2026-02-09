import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

const handleQueryError = (error) => {
  console.error('Query error:', error)
  
  if (!navigator.onLine) {
    console.error('Нет подключения к интернету')
  }
  
}

const handleMutationError = (error) => {
  console.error('Mutation error:', error)
  
  if (!navigator.onLine) {
    console.error('Нет подключения к интернету')
  }
  
}

queryClient.setMutationDefaults(['patients', 'doctors', 'appointments'], {
  onError: handleMutationError,

  retry: (failureCount, error) => {

    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return false
    }

    return failureCount < 1
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
})

queryClient.setQueryDefaults(['patients', 'doctors', 'appointments'], {
  onError: handleQueryError,
  retry: (failureCount, error) => {
    if (error?.response?.status >= 400 && error?.response?.status < 500) {
      return false
    }
    return failureCount < 3
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
})

