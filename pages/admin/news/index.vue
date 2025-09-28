<template>
  <div class="admin-news-page">
    <header class="page-header">
      <div class="page-header-content">
        <div class="page-title">
          <h1>Gerenciar Notícias</h1>
          <p>Gerencie as notícias e eventos do portal</p>
        </div>
        <div class="page-actions">
          <NuxtLink class="btn btn-primary" to="/admin/news/create">
            Nova Notícia
          </NuxtLink>
        </div>
      </div>
    </header>

    <section class="filters-section">
      <div class="search-box">
        <div class="search-wrapper">
          <Icon name="mdi:magnify" class="search-icon" />
          <input
            class="search-input"
            v-model="searchQuery"
            placeholder="Pesquisar notícias..."
          />
        </div>
      </div>
      <div class="filters">
        <select class="filter-select" v-model="statusFilter">
          <option value="">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
        <select class="filter-select" v-model="categoryFilter">
          <option value="">Todas as Categorias</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
    </section>

    <main class="news-list-container">
      <div class="news-table-wrapper">
        <table class="news-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Categoria</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <!-- O loop agora usa 'displayedNews' que vem direto da store -->
            <tr class="news-row" v-for="news in displayedNews" :key="news.id">
              <td>
                <div class="news-title-cell">
                  <div class="news-image-wrapper">
                    <img v-if="news.imageUrl" :src="news.imageUrl" :alt="news.title" />
                    <Icon v-else name="mdi:image-outline" class="placeholder-icon" />
                  </div>
                  <div class="news-info">
                    <h3>{{ news.title }}</h3>
                    <p>{{ news.excerpt }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(news.status)">
                  {{ getStatusText(news.status) }}
                </span>
              </td>
              <td>{{ news.category }}</td>
              <td>{{ formatDate(news.updatedAt) }}</td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn" @click="viewNews(news)" :aria-label="`Ver notícia ${news.title}`">
                    <Icon name="mdi:eye" />
                  </button>
                  <button class="action-btn" @click="editNews(news)" :aria-label="`Editar notícia ${news.title}`">
                    <Icon name="mdi:pencil" />
                  </button>
                  <button class="action-btn" @click="deleteNews(news)" :aria-label="`Excluir notícia ${news.title}`">
                    <Icon name="mdi:trash-can" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" v-if="!isLoading && displayedNews.length === 0">
        <h3>Nenhuma notícia encontrada</h3>
        <p>{{ searchQuery ? 'Tente ajustar os filtros de pesquisa.' : 'Comece criando sua primeira notícia.' }}</p>
        <NuxtLink class="btn btn-primary" v-if="!searchQuery" to="/admin/news/create">
          Nova Notícia
        </NuxtLink>
      </div>

      <div class="loading-state" v-if="isLoading">
        <div class="loading-spinner"></div>
        <p>Carregando notícias...</p>
      </div>

      <footer class="pagination-section" v-if="totalPages > 1">
        <div class="pagination-info">
          Mostrando {{ (currentPage - 1) * 10 + 1 }} a {{ Math.min(currentPage * 10, newsStore.totalItems) }} de {{ newsStore.totalItems }} resultados
        </div>
        <div class="pagination-controls">
          <button class="pagination-btn" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
            <Icon name="mdi:chevron-left" />
          </button>
          <div class="pagination-numbers">
            <button
              class="pagination-btn"
              v-for="page in visiblePages"
              :key="page"
              :class="{ 'active': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button class="pagination-btn" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            <Icon name="mdi:chevron-right" />
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/news'
import { watchDebounced } from '@vueuse/core'

// Meta tags e Middleware
useHead({
  title: 'Gerenciar Notícias - Admin LATECE',
  meta: [{ name: 'description', content: 'Gerenciar notícias do Portal LATECE' }]
})
definePageMeta({
  middleware: 'auth'
})

// Stores
const newsStore = useNewsStore()

// Reactive data para os filtros da UI
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

// Computed properties que leem o estado diretamente da store
const displayedNews = computed(() => newsStore.news)
const isLoading = computed(() => newsStore.isLoading)
const totalPages = computed(() => newsStore.totalPages)
const currentPage = computed(() => newsStore.currentPage)
const categories = computed(() => ['Evento', 'Notícia', 'Aviso', 'Workshop', 'Palestra'])

const visiblePages = computed(() => {
  const pages = []
  if (totalPages.value <= 1) return []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods que chamam as actions da store
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    newsStore.setPage(page)
    newsStore.fetchNews()
  }
}

// Observa mudanças nos filtros e chama a API através da store
watchDebounced([searchQuery, statusFilter, categoryFilter], () => {
  newsStore.setFilters({
    search: searchQuery.value,
    category: categoryFilter.value,
    // Adicione o status se sua API e store suportarem
  })
  newsStore.setPage(1) // Sempre reseta para a primeira página ao filtrar
  newsStore.fetchNews()
}, { debounce: 500 })

// Busca as notícias iniciais quando o componente é montado
onMounted(() => {
  newsStore.setFilters({}) // Limpa filtros antigos
  newsStore.setPage(1)
  newsStore.fetchNews()
})

// Funções de UI (permanecem no componente)
const getStatusClass = (status: string) => {
  if (status === 'published') return 'status-published'
  if (status === 'draft') return 'status-draft'
  return 'status-default'
}

const getStatusText = (status: string) => {
  if (status === 'published') return 'Publicado'
  if (status === 'draft') return 'Rascunho'
  return status
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const viewNews = (news: any) => {
  // Ex: router.push(`/news/${news.id}`)
  console.log('View news:', news)
}

const editNews = (news: any) => {
  navigateTo(`/admin/news/edit/${news.id}`)
}

const deleteNews = async (news: any) => {
  if (confirm(`Tem certeza que deseja excluir a notícia "${news.title}"?`)) {
    await newsStore.deleteNews(news.id)
  }
}
</script>

<style scoped>
/* ================================ */
/* CSS Variables */
/* ================================ */
:root {
  --primary-blue: #005A9C;
  --white: #ffffff;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --green-100: #dcfce7;
  --green-800: #166534;
  --yellow-100: #fef9c3;
  --yellow-800: #854d0e;
  --red-600: #dc2626;
  --yellow-600: #ca8a04;
  --focus-ring: 0 0 0 3px rgba(0, 90, 156, 0.3);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

/* ================================ */
/* Page Layout & Header */
/* ================================ */
.admin-news-page {
  background-color: var(--gray-50);
}

.page-header {
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 1.5rem;
}

.page-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--gray-900);
}

.page-title p {
  font-size: 0.875rem;
  color: var(--gray-600);
}

/* ================================ */
/* Filters & Search */
/* ================================ */
.filters-section {
  background-color: var(--white);
  border-bottom: 1px solid var(--gray-200);
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  flex-grow: 1;
  max-width: 28rem;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 1.25rem;
}

.search-input, .filter-select {
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease-in-out;
}
.search-input {
  width: 100%;
  padding-left: 2.5rem;
}

.search-input:focus, .filter-select:focus {
  outline: none;
  border-color: transparent;
  box-shadow: var(--focus-ring);
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* ================================ */
/* News Table */
/* ================================ */
.news-list-container {
  background-color: var(--white);
  margin: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.news-table-wrapper {
  overflow-x: auto;
}

.news-table {
  width: 100%;
  border-collapse: collapse;
}

.news-table thead {
  background-color: var(--gray-50);
}

.news-table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.news-table tbody {
  background-color: var(--white);
  border-top: 1px solid var(--gray-200);
}

.news-row {
  transition: background-color 0.2s ease-in-out;
}

.news-row:hover {
  background-color: var(--gray-50);
}

.news-table td {
  padding: 1rem 1.5rem;
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--gray-900);
  border-bottom: 1px solid var(--gray-200);
}
.news-row:last-child td {
  border-bottom: none;
}

.news-title-cell {
  display: flex;
  align-items: center;
}

.news-image-wrapper {
  width: 3rem;
  height: 3rem;
  background-color: var(--gray-200);
  border-radius: 0.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.news-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-image-wrapper .placeholder-icon {
  color: var(--gray-400);
  font-size: 1.5rem;
}

.news-info h3 {
  font-weight: 500;
  color: var(--gray-900);
}

.news-info p {
  color: var(--gray-500);
  white-space: normal;
  max-width: 30ch;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
}

.status-published {
  background-color: var(--green-100);
  color: var(--green-800);
}

.status-draft {
  background-color: var(--yellow-100);
  color: var(--yellow-800);
}

.status-default {
  background-color: var(--gray-100);
  color: var(--gray-800);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  color: var(--gray-400);
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  font-size: 1.25rem;
}

.action-btn:hover {
  transform: scale(1.1);
  color: var(--primary-blue);
}

.action-btn:nth-child(2):hover {
  color: var(--yellow-600);
}

.action-btn:nth-child(3):hover {
  color: var(--red-600);
}

/* ================================ */
/* Empty & Loading States */
/* ================================ */
.empty-state, .loading-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--gray-900);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--gray-500);
  margin-bottom: 1rem;
}

.loading-state p {
  margin-top: 0.5rem;
  color: var(--gray-600);
}

.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 4px solid var(--primary-blue);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ================================ */
/* Pagination */
/* ================================ */
.pagination-section {
  background-color: var(--white);
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--gray-700);
}

.pagination-controls, .pagination-numbers {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  background-color: var(--white);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--gray-100);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn.active {
  background-color: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
}

/* ================================ */
/* Responsive Design */
/* ================================ */
@media (min-width: 1024px) {
  .filters-section {
    flex-direction: row;
  }
}

/* Adicionando classes de botão genéricas que podem estar faltando */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--primary-blue);
  color: var(--white);
  border-color: var(--primary-blue);
}

.btn-primary:hover {
  background-color: #004b80; /* Cor um pouco mais escura */
  border-color: #004b80;
}

</style>
