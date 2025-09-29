<template>
  <div class="news-page-container">
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">Notícias e Eventos</h1>
        <p class="page-subtitle">Acompanhe as últimas novidades, pesquisas e acontecimentos do LATECE.</p>
      </div>
    </header>

    <section class="filters-section">
      <div class="container filters-wrapper">
        <div class="search-input-wrapper">
          <Icon name="mdi:magnify" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Pesquisar por título ou conteúdo..."
          />
        </div>
        <div class="category-select-wrapper">
          <select v-model="selectedCategory" class="category-select">
            <option value="">Todas as Categorias</option>
            <option value="Evento">Evento</option>
            <option value="Notícia">Notícia</option>
            <option value="Aviso">Aviso</option>
            <option value="Workshop">Workshop</option>
            <option value="Palestra">Palestra</option>
          </select>
        </div>
      </div>
    </section>

    <main class="main-content">
      <div class="container">
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Carregando notícias...</p>
        </div>

        <div v-else-if="displayedNews.length > 0" class="news-grid">
          <article v-for="news in displayedNews" :key="news.id" class="news-card">
            <NuxtLink :to="`/news/${news.id}`" class="card-link">
              <div class="card-image-wrapper">
                <img v-if="news.imageUrl" :src="news.imageUrl" :alt="news.title" class="card-image" />
                <div v-else class="image-placeholder">
                  <Icon name="mdi:image-outline" />
                </div>
              </div>
              <div class="card-content">
                <div class="card-meta">
                  <span class="card-category">{{ news.category }}</span>
                  <span class="card-date">{{ formatDate(news.createdAt) }}</span>
                </div>
                <h3 class="card-title">{{ news.title }}</h3>
                <p class="card-excerpt">{{ news.excerpt }}</p>
                <span class="read-more-link">Leia Mais <Icon name="mdi:arrow-right" /></span>
              </div>
            </NuxtLink>
          </article>
        </div>

        <div v-else class="empty-state">
          <Icon name="mdi:alert-circle-outline" class="empty-icon" />
          <h2>Nenhuma notícia encontrada</h2>
          <p>Tente ajustar os termos da sua busca ou limpar os filtros.</p>
        </div>

        <nav v-if="totalPages > 1 && !isLoading" class="pagination-nav">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-button">
            <Icon name="mdi:chevron-left" />
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="pagination-button"
            :class="{ 'active': page === currentPage }"
          >
            {{ page }}
          </button>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-button">
            <Icon name="mdi:chevron-right" />
          </button>
        </nav>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
:root {
  --primary-color: #1D8A9F;
  --secondary-color: #64B8D1;
  --text-dark: #111827;
  --text-light: #4b5563;
  --bg-light: #f9fafb;
  --border-color: #e5e7eb;
}

.news-page-container {
  background-color: var(--bg-light);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.page-header {
  background: white;
  padding: 3rem 0;
  text-align: center;
  border-bottom: 1px solid var(--border-color);

  .page-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  .page-subtitle {
    font-size: 1.125rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
  }
}

/* Filtros */
.filters-section {
  padding: 1.5rem 0;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}
.filters-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
}
.search-input-wrapper {
  position: relative;
  flex-grow: 1;
}
.search-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.25rem;
}
.search-input, .category-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(29, 138, 159, 0.2);
  }
}
.search-input {
  padding-left: 2.75rem;
}

/* Conteúdo Principal */
.main-content {
  padding: 3rem 0;
}

/* Grid de Notícias */
.news-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Card de Notícia */
.news-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
  }
}
.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.card-image-wrapper {
  width: 100%;
  padding-top: 56.25%; /* Proporção 16:9 */
  position: relative;
  background-color: var(--border-color);
}
.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #9ca3af;
}
.card-content {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--text-light);
  margin-bottom: 0.75rem;
}
.card-category {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}
.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}
.card-excerpt {
  color: var(--text-light);
  line-height: 1.6;
  flex-grow: 1;
  margin-bottom: 1rem;
}
.read-more-link {
  color: var(--primary-color);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: gap 0.2s ease;
  
  .news-card:hover & {
    gap: 0.75rem;
  }
}

/* Estados de Loading e Vazio */
.loading-state, .empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-light);
}
.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
.empty-icon {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}
.empty-state h2 {
  font-size: 1.5rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

/* Paginação */
.pagination-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
}
.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
  &.active {
    background-color: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

<script setup lang="ts">
import { useNewsStore } from '@/stores/news'
import { watchDebounced } from '@vueuse/core' // Uma forma mais elegante de fazer debounce

// Meta tags
useHead({
  title: 'Notícias - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Fique por dentro das últimas notícias e eventos do Laboratório de Tecnologia Assistiva da UFRN' }
  ]
})

// Stores
const newsStore = useNewsStore()

// Reactive data para os filtros
const searchQuery = ref('')
const selectedCategory = ref('')

// Computed properties que leem diretamente da store
const displayedNews = computed(() => newsStore.news)
const isLoading = computed(() => newsStore.isLoading)
const totalPages = computed(() => newsStore.totalPages)
const currentPage = computed(() => newsStore.currentPage)

// Lógica de paginação visível (permanece igual)
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

// Methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    newsStore.setPage(page)
    newsStore.fetchNews()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Observa mudanças nos filtros e busca os dados com debounce (espera 500ms após o usuário parar de digitar)
watchDebounced([searchQuery, selectedCategory], () => {
  newsStore.setFilters({
    search: searchQuery.value,
    category: selectedCategory.value,
  })
  // Reseta para a primeira página e busca
  if (currentPage.value !== 1) {
    newsStore.setPage(1)
  }
  newsStore.fetchNews()
}, { debounce: 500, maxWait: 2000 })


// Busca as notícias iniciais quando o componente é montado
onMounted(() => {
  // Limpa filtros antigos e busca os dados da primeira página
  newsStore.setFilters({})
  newsStore.setPage(1)
  newsStore.fetchNews()
})
</script>