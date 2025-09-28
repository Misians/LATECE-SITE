import { defineStore } from 'pinia'
import type { News, NewsFormData } from '@/types' // Importando os tipos

// Interface para os filtros
interface NewsFilters {
  search?: string
  category?: string
}

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [] as News[],
    currentNews: null as News | null, // Para guardar a notícia ativa (ex: na página de edição)
    isLoading: false,
    error: null as string | null,
    // Estado para paginação e filtros
    currentPage: 1,
    itemsPerPage: 9,
    totalItems: 0,
    filters: {} as NewsFilters,
  }),

  getters: {
    totalPages: (state) => {
      if (state.totalItems === 0) return 1
      return Math.ceil(state.totalItems / state.itemsPerPage)
    },
  },

  actions: {
    setFilters(newFilters: NewsFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    setPage(page: number) {
      this.currentPage = page
    },

    // Ação principal para buscar a lista de notícias (já existente)
    async fetchNews() {
      this.isLoading = true
      this.error = null
      try {
        const { $api } = useNuxtApp()
        const params = new URLSearchParams()
        params.append('page', this.currentPage.toString())
        params.append('limit', this.itemsPerPage.toString())
        if (this.filters.search) params.append('search', this.filters.search)
        if (this.filters.category) params.append('category', this.filters.category)

        const response = await $api<{ data: News[], total: number }>(`/api/news?${params.toString()}`)
        this.news = response.data
        this.totalItems = response.total
      } catch (error: any) {
        this.error = error.data?.message || 'Erro ao carregar notícias'
        console.error('Fetch news error:', error)
      } finally {
        this.isLoading = false
      }
    },

    // ===============================================
    // NOVAS AÇÕES ADICIONADAS
    // ===============================================

    /**
     * Busca uma única notícia pelo ID e a armazena em 'currentNews'.
     * @param id - O ID da notícia a ser buscada.
     */
    async fetchNewsById(id: number) {
      this.isLoading = true
      this.error = null
      this.currentNews = null
      try {
        const { $api } = useNuxtApp()
        this.currentNews = await $api<News>(`/api/news/${id}`)
        return this.currentNews
      } catch (error: any) {
        this.error = error.data?.message || 'Notícia não encontrada'
        console.error(`Fetch news by ID (${id}) error:`, error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Cria uma nova notícia.
     * @param newsData - Os dados da notícia, geralmente um objeto FormData se incluir imagem.
     */
    async createNews(newsData: NewsFormData | FormData) {
      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        const newNews = await $api<News>('/api/news', {
          method: 'POST',
          body: newsData,
        })
        // Opcional: recarregar a lista para refletir a nova adição e paginação correta
        await this.fetchNews() 
        return { success: true, data: newNews }
      } catch (error: any) {
        console.error('Create news error:', error)
        return { success: false, error: error.data?.message || 'Erro ao criar notícia' }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Atualiza uma notícia existente.
     * @param id - O ID da notícia a ser atualizada.
     * @param newsData - Os novos dados da notícia.
     */
    async updateNews(id: number, newsData: NewsFormData | FormData) {
      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        const updatedNews = await $api<News>(`/api/news/${id}`, {
          method: 'PUT',
          body: newsData,
        })
        
        // Atualiza a lista localmente
        const index = this.news.findIndex(n => n.id === id)
        if (index !== -1) {
          this.news[index] = updatedNews
        }
        if (this.currentNews?.id === id) {
          this.currentNews = updatedNews
        }
        
        return { success: true, data: updatedNews }
      } catch (error: any) {
        console.error('Update news error:', error)
        return { success: false, error: error.data?.message || 'Erro ao atualizar notícia' }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Deleta uma notícia.
     * @param id - O ID da notícia a ser deletada.
     */
    async deleteNews(id: number) {
      this.isLoading = true
      try {
        const { $api } = useNuxtApp()
        await $api(`/api/news/${id}`, { method: 'DELETE' })
        
        // Remove da lista e atualiza o total
        this.news = this.news.filter(n => n.id !== id)
        this.totalItems--
        
        return { success: true }
      } catch (error: any) {
        console.error('Delete news error:', error)
        return { success: false, error: error.data?.message || 'Erro ao deletar notícia' }
      } finally {
        this.isLoading = false
      }
    },
  },
})