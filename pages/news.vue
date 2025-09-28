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