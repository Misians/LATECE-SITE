import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      // Add auth token if available
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Create a new Headers object
          const headers = new Headers(options.headers)
          // Set the Authorization header
          headers.set('Authorization', `Bearer ${token}`)
          // Assign the new headers object back to the options
          options.headers = headers
        }
      }
    },
    onRequestError({ request, error }) {
      console.error('API Request Error:', error)
    },
    onResponseError({ request, response, options }) {
      console.error('API Response Error:', response.status, response.statusText)
      
      // Handle 401 errors (unauthorized)
      if (response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
      }
    }
  })
  
  return {
    provide: {
      api
    }
  }
})
