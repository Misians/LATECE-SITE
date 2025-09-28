import { defineStore } from 'pinia'
import type { User, LoginCredentials } from '@/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: useCookie('auth_token', { maxAge: 60 * 60 * 24 }), // <-- CORRIGIDO: Usa useCookie
    isAuthenticated: false,
    isLoading: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => ['admin', 'editor'].includes(state.user?.role || ''),
    userInitials: (state) => {
      if (!state.user?.fullName) return ''
      return state.user.fullName
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .toUpperCase()
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        const response = await $api<{ token: string, user: User }>('/api/auth/login', {
          method: 'POST',
          body: credentials
        });
        
        this.user = response.user;
        this.token = response.token; // Salva o token no cookie
        this.isAuthenticated = true;

        return { success: true };
      } catch (error: any) {
        console.error('Login error:', error);
        this.logout(); // Limpa o estado em caso de falha
        return { 
          success: false, 
          error: error.data?.statusMessage || 'Erro ao fazer login' 
        };
      } finally {
        this.isLoading = false;
      }
    },

    async logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      if (process.client) {
        localStorage.removeItem('auth_token')
      }
      
      await navigateTo('/')
    },

    async verifyToken() {
      if (!this.token) return false
      
      try {
        const { $api } = useNuxtApp()
        // O token já é adicionado pelo plugin, não precisa enviar nos headers aqui
        const response = await $api('/auth/verify')
        
        this.user = response.data.user
        this.isAuthenticated = true
        return true
      } catch (error) {
        console.error('Token verification error:', error)
        this.logout() // Faz logout se o token for inválido
      }
      
      return false
    },

    async initializeAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        if (token) {
          this.token = token
          await this.verifyToken()
        }
      }
    },

    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    }
  }
})