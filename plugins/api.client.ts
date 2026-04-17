// plugins/api.client.ts

import { ofetch } from 'ofetch'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin((_nuxtApp) => {
  const api = ofetch.create({
    baseURL: '',

    async onRequest({ options }) {
      const authStore = useAuthStore()
      if (authStore.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${authStore.token}`)
        options.headers = headers
      }
    },

    // ✨ LÓGICA CORRIGIDA AQUI ✨
    async onResponseError({ request, response, options }) {
      // Se o erro for 401 e a requisição NÃO for do tipo GET
      if (response.status === 401 && options.method !== 'GET') {
        const authStore = useAuthStore()
        console.error('Token inválido para uma ação protegida. Deslogando...')
        
        // Use a action de logout da sua store
        await authStore.logout() // Supondo que você tenha uma action 'logout'

        // Redireciona para a página de login
        await navigateTo('/login')
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})