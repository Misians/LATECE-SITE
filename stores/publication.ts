import { defineStore } from 'pinia'
import type { Publication } from '@/types/publication'

export const usePublicationStore = defineStore('publication', {
  state: () => ({
    publications: [] as Publication[],
    currentPublication: null as Publication | null,
    types: [] as string[],
    years: [] as number[],
    isLoading: false,
    error: null as string | null
  }),

  getters: {
    hasPublications: (state) => state.publications.length > 0,
    publicationsByType: (state) => (type: string) => 
      state.publications.filter(p => p.type === type),
    publicationsByYear: (state) => (year: number) => 
      state.publications.filter(p => p.year === year),
    publishedPublications: (state) => 
      state.publications.filter(p => p.status === 'published')
  },

  actions: {
    async fetchPublications() {
      this.isLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        // O $fetch já retorna o corpo da resposta diretamente
        const responseData = await $api<Publication[]>('/publications', { method: 'GET' })
        this.publications = responseData
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Erro ao carregar publicações'
        console.error('Fetch publications error:', error)
      } finally {
        this.isLoading = false
      }
    },

    async fetchPublicationById(id: number) {
      this.isLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const responseData = await $api<Publication>(`/publications/${id}`, { method: 'GET' })
        this.currentPublication = responseData
        return this.currentPublication
      } catch (error: any) {
        this.error = error.data?.error?.message || 'Publicação não encontrada'
        console.error('Fetch publication by ID error:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createPublication(publicationData: Partial<Publication>) {
      try {
        const { $api } = useNuxtApp()
        const newPublication = await $api<Publication>('/publications', {
          method: 'POST',
          body: publicationData
        })
        this.publications.push(newPublication)
        return { success: true, data: newPublication }
      } catch (error: any) {
        console.error('Create publication error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao criar publicação' 
        }
      }
    },

    async updatePublication(id: number, publicationData: Partial<Publication>) {
      try {
        const { $api } = useNuxtApp()
        const updatedPublication = await $api<Publication>(`/publications/${id}`, {
          method: 'PUT',
          body: publicationData
        })
        
        const index = this.publications.findIndex(p => p.id === id)
        if (index !== -1) {
          this.publications[index] = updatedPublication
        }
        if (this.currentPublication?.id === id) {
          this.currentPublication = updatedPublication
        }
        
        return { success: true, data: updatedPublication }
      } catch (error: any) {
        console.error('Update publication error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao atualizar publicação' 
        }
      }
    },

    async deletePublication(id: number) {
      try {
        const { $api } = useNuxtApp()
        await $api(`/publications/${id}`, { method: 'DELETE' })
        
        this.publications = this.publications.filter(p => p.id !== id)
        if (this.currentPublication?.id === id) {
          this.currentPublication = null
        }
        
        return { success: true }
      } catch (error: any) {
        console.error('Delete publication error:', error)
        return { 
          success: false, 
          error: error.data?.error?.message || 'Erro ao excluir publicação' 
        }
      }
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.publications = []
      this.currentPublication = null
      this.types = []
      this.years = []
      this.isLoading = false
      this.error = null
    }
  }
})
