<template lang="pug">
  .publications-page
    // Hero Section
    section.hero
      .container
        h1.hero-title {{ $t('publications.title') }}
        p.hero-subtitle {{ $t('publications.subtitle') }}
    
    // Filter and Search Section
    section.filters
      .container
        .filter-wrapper
          // Search
          .search-box
            input.search-input(
              v-model="searchQuery",
              :placeholder="$t('publications.searchPlaceholder')",
              @input="filterPublications"
            )
          
          // Filters
          .filters-row
            // Type Filter
            .type-filter
              select.filter-select(v-model="selectedType", @change="filterPublications")
                option(value="") {{ $t('publications.allTypes') }}
                option(
                  v-for="type in publicationStore.types",
                  :key="type",
                  :value="type"
                ) {{ type }}
            
            // Year Filter
            .year-filter
              select.filter-select(v-model="selectedYear", @change="filterPublications")
                option(value="") {{ $t('publications.allYears') }}
                option(
                  v-for="year in publicationStore.years",
                  :key="year",
                  :value="year"
                ) {{ year }}
    
    // Publications List Section
    section.publications-list
      .container
        // Loading State
        .state-indicator(v-if="publicationStore.isLoading")
          .loading-spinner
          p {{ $t('common.loading') }}
        
        // Empty State
        .state-indicator(v-else-if="filteredPublications.length === 0")
          p.empty-title {{ $t('publications.noPublications') }}
          p.empty-subtitle {{ $t('publications.tryDifferentSearch') }}
        
        // Publications Grid
        .publications-grid(v-else)
          .publication-item(
            v-for="publication in filteredPublications",
            :key="publication.id"
          )
            .publication-header
              .publication-info
                .publication-meta
                  .publication-type {{ publication.type }}
                  .publication-year {{ publication.year }}
                  .publication-status(
                    v-if="publication.status",
                    :class="`status-${publication.status}`"
                  ) {{ publication.status }}
                
                h3.publication-title {{ publication.title }}
                .publication-authors
                  span Autores: 
                  span {{ publication.authors }}
              
              .publication-actions
                button.btn.btn-primary(
                  v-if="publication.fileUrl",
                  @click="downloadPublication(publication)"
                )
                  span {{ $t('publications.download') }}
                
                button.btn.btn-outline(
                  @click="viewPublicationDetails(publication)"
                )
                  span {{ $t('publications.viewDetails') }}
  
            p.publication-abstract(v-if="publication.abstract") {{ publication.abstract }}
            
            .publication-keywords(v-if="publication.keywords && publication.keywords.length > 0")
              span.keyword(
                v-for="keyword in publication.keywords",
                :key="keyword"
              ) #{{ keyword }}
              
    // Publication Details Modal
    .publication-modal(v-if="selectedPublication", @click.self="closePublicationDetails")
      .modal-content
        .modal-header
          h3.modal-title {{ selectedPublication.title }}
          button.close-button(@click="closePublicationDetails", :aria-label="$t('common.close')")
        
        .modal-body
          .publication-details
            .publication-meta-grid
              .meta-item
                h4.meta-label {{ $t('publications.type') }}
                p.meta-value {{ selectedPublication.type }}
              
              .meta-item
                h4.meta-label {{ $t('publications.year') }}
                p.meta-value {{ selectedPublication.year }}
              
              .meta-item
                h4.meta-label {{ $t('publications.authors') }}
                p.meta-value {{ selectedPublication.authors }}
              
              .meta-item
                h4.meta-label {{ $t('publications.status') }}
                p.meta-value {{ selectedPublication.status }}
  
            .publication-abstract(v-if="selectedPublication.abstract")
              h4.meta-label {{ $t('publications.abstract') }}
              p.meta-value {{ selectedPublication.abstract }}
            
            .publication-keywords(v-if="selectedPublication.keywords && selectedPublication.keywords.length > 0")
              h4.meta-label {{ $t('publications.keywords') }}
              .keywords-list
                span.keyword(
                  v-for="keyword in selectedPublication.keywords",
                  :key="keyword"
                ) #{{ keyword }}
                
            .modal-actions
              button.btn.btn-primary.btn-lg(
                v-if="selectedPublication.fileUrl",
                @click="downloadPublication(selectedPublication)"
              )
                span {{ $t('publications.download') }}
  </template>

<script setup lang="ts">
import { usePublicationStore } from '@/stores/publication'
import type { Publication } from '@/types/publication' // Importe a "fonte da verdade"

// Meta tags
useHead({
  title: 'Publicações - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Acesse as publicações e pesquisas do Laboratório de Tecnologia Assistiva da UFRN' }
  ]
})

// Stores
const publicationStore = usePublicationStore()

// Reactive data
const searchQuery = ref('')
const selectedType = ref('')
const selectedYear = ref('')
const selectedPublication = ref<Publication | null>(null) // Adicionando tipo para segurança

// Computed properties
const filteredPublications = computed(() => {
  // TypeScript já sabe que 'publications' é um array de Publication[]
  let publications = publicationStore.publishedPublications

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    // Remova as tipagens manuais. TypeScript inferirá 'item' como 'Publication'
    publications = publications.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.authors.toLowerCase().includes(query) ||
      (item.abstract && item.abstract.toLowerCase().includes(query)) ||
      (item.keywords && item.keywords.some(keyword => keyword.toLowerCase().includes(query)))
    )
  }
  
  // Filter by type
  if (selectedType.value) {
    publications = publications.filter(item => item.type === selectedType.value)
  }
  
  // Filter by year
  if (selectedYear.value) {
    // Converte o valor do select (string) para número antes de comparar
    const yearAsNumber = parseInt(selectedYear.value, 10)
    publications = publications.filter(item => item.year === yearAsNumber)
  }
  
  return publications
})

// Methods
const filterPublications = () => {
  // A filtragem já é reativa por causa da computed property,
  // mas esta função pode ser usada para resetar a paginação no futuro.
}

const viewPublicationDetails = (publication: Publication) => {
  selectedPublication.value = publication
}

const closePublicationDetails = () => {
  selectedPublication.value = null
}

const downloadPublication = (publication: Publication) => {
  if (publication.fileUrl) {
    window.open(publication.fileUrl, '_blank')
  }
}

// Fetch publications on mount
onMounted(() => {
  publicationStore.fetchPublications()
  // Se você tiver essas actions na store, pode descomentá-las
  // publicationStore.fetchTypes() 
  // publicationStore.fetchYears()
})
</script>

<style scoped lang="scss">
// Variáveis (ajuste conforme seu design system)
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(to bottom right, $primary-blue, $light-blue);
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$green-100: #dcfce7;
$green-800: #166534;
$yellow-100: #fef9c3;
$yellow-800: #854d0e;
$blue-100: #dbeafe;
$blue-800: #1e40af;
$focus-ring-color: rgba(29, 138, 159, 0.4);

// Mixin para botões
@mixin btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;

  &.btn-primary {
    background-color: $primary-blue;
    color: white;
    &:hover { background-color: darken($primary-blue, 10%); }
  }

  &.btn-outline {
    background-color: transparent;
    border-color: $primary-blue;
    color: $primary-blue;
    &:hover { background-color: $primary-blue; color: white; }
  }
  
  &.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
}

// Estilos Gerais da Página
.container {
  width: 100%;
  max-width: 72rem; // max-w-6xl
  margin: 0 auto;
  padding: 0 1rem;
}

// Seção Hero
.hero {
  padding: 5rem 0;
  color: white;
  background: $primary-gradient;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

// Seção de Filtros
.filters {
  padding: 2rem 0;
  background-color: $gray-50;
}

.filter-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 1024px) { // lg
    flex-direction: row;
  }
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 28rem; // max-w-md
  width: 100%;

  .search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid $gray-300;
    border-radius: 0.5rem;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px $focus-ring-color;
    }
  }

  :deep(svg) {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1rem;
    height: 1rem;
    color: $gray-400;
  }
}

.filters-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 640px) { // sm
    flex-direction: row;
  }
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid $gray-300;
  border-radius: 0.5rem;
  width: 100%;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px $focus-ring-color;
  }
}

// Seção da Lista de Publicações
.publications-list {
  padding: 4rem 0;
  background-color: white;
}

.publications-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.publication-item {
  padding: 1.5rem;
  border: 1px solid $gray-200;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.publication-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 1rem;

  @media (min-width: 1024px) { // lg
    flex-direction: row;
    align-items: flex-start;
  }
}

.publication-info {
  flex-grow: 1;
}

.publication-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.publication-type {
  padding: 0.25rem 0.75rem;
  background-color: $primary-blue;
  color: white;
  border-radius: 9999px;
}

.publication-year {
  color: $gray-500;
}

.publication-status {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;

  &.status-published { background-color: $green-100; color: $green-800; }
  &.status-submitted { background-color: $yellow-100; color: $yellow-800; }
  &.status-in_progress { background-color: $blue-100; color: $blue-800; }
}

.publication-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 0.75rem;
}

.publication-authors {
  color: $gray-600;
  margin-bottom: 1rem;
  span:first-child { font-weight: 500; }
}

.publication-abstract {
  color: $gray-700;
  margin-bottom: 1rem;
}

.publication-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.keyword {
  padding: 0.25rem 0.5rem;
  background-color: $gray-100;
  color: $gray-700;
  font-size: 0.875rem;
  border-radius: 0.25rem;
}

.publication-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;

  @media (min-width: 640px) { // sm
    flex-direction: row;
  }
  @media (min-width: 1024px) { // lg
    margin-left: 1.5rem;
    margin-top: 0;
  }

  .btn {
    @include btn;
  }
}

// Estados de Loading e Vazio
.state-indicator {
  text-align: center;
  padding: 3rem 0;
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 4px solid $primary-blue;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  p { margin-top: 0.5rem; color: $gray-600; }
  :deep(svg) {
    width: 4rem;
    height: 4rem;
    color: $gray-400;
    margin: 0 auto 1rem;
  }
  .empty-title { font-size: 1.125rem; margin-bottom: 1rem; }
  .empty-subtitle { color: $gray-500; }
}

// Modal
.publication-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
  max-width: 56rem; // max-w-4xl
  width: 100%;
  margin: 1rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideInUp 0.3s ease-out;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid $gray-200;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $primary-blue;
}

.close-button {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  background: none;
  cursor: pointer;
  &:hover { background-color: $gray-100; }
  :deep(svg) { width: 1.5rem; height: 1.5rem; }
}

.modal-body {
  padding: 1.5rem;
}

.publication-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.publication-meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) { // md
    grid-template-columns: repeat(2, 1fr);
  }
}

.meta-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: $primary-blue;
  margin-bottom: 0.5rem;
}

.meta-value, .abstract-text {
  color: $gray-700;
  line-height: 1.6;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 1px solid $gray-200;

  .btn {
    @include btn;
  }
}

// Animações
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideInUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>