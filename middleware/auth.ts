import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
  
  // Check if user has admin role for admin routes
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso negado. Apenas administradores podem acessar esta área.'
    })
  }
})
