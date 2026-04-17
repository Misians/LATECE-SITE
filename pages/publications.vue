<template lang="pug">
  .publications-page
    // Hero Section
    section.hero
      .container
        h1.hero-title Publicações Científicas
        p.hero-subtitle Conheça nossas pesquisas e contribuições para a área de Tecnologia Assistiva

    // Filter and Search Section
    section.filters
      .container
        .filter-wrapper
          // Search
          .search-box
            input.search-input(
              v-model="searchQuery",
              placeholder="Buscar por título, autor ou palavra-chave...",
              @input="filterPublications"
            )
          
          // Filters
          .filters-row
            // Type Filter
            .type-filter
              select.filter-select(v-model="selectedType", @change="filterPublications")
                option(value="") Todos os Tipos
                option(value="Artigo") Artigo
                option(value="Dissertação") Dissertação
                option(value="Tese") Tese
                option(value="Capítulo de Livro") Capítulo de Livro
            
            // Year Filter
            .year-filter
              select.filter-select(v-model="selectedYear", @change="filterPublications")
                option(value="") Todos os Anos
                option(value="2024") 2024
                option(value="2023") 2023
                option(value="2022") 2022
                option(value="2021") 2021

    // Publications List Section
    section.publications-list
      .container
        // Publications Grid
        .publications-grid
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
                    :class="`status-${publication.status}`"
                  ) {{ getStatusLabel(publication.status) }}
                
                h3.publication-title {{ publication.title }}
                .publication-authors
                  span Autores: 
                  span {{ publication.authors }}
              
              .publication-actions
                button.btn.btn-primary(
                  @click="downloadPublication(publication)"
                )
                  span 📥 Download
                
                button.btn.btn-outline(
                  @click="viewPublicationDetails(publication)"
                )
                  span 👁️ Ver Detalhes
  
            p.publication-abstract {{ publication.abstract }}
            
            .publication-keywords
              span.keyword(
                v-for="keyword in publication.keywords",
                :key="keyword"
              ) #{{ keyword }}
              
    // Publication Details Modal
    .publication-modal(v-if="selectedPublication", @click.self="closePublicationDetails")
      .modal-content
        .modal-header
          h3.modal-title {{ selectedPublication.title }}
          button.close-button(@click="closePublicationDetails")
            span ✕
        
        .modal-body
          .publication-details
            .publication-meta-grid
              .meta-item
                h4.meta-label Tipo de Publicação
                p.meta-value {{ selectedPublication.type }}
              
              .meta-item
                h4.meta-label Ano
                p.meta-value {{ selectedPublication.year }}
              
              .meta-item
                h4.meta-label Autores
                p.meta-value {{ selectedPublication.authors }}
              
              .meta-item
                h4.meta-label Status
                p.meta-value {{ getStatusLabel(selectedPublication.status) }}
  
            .publication-abstract-section
              h4.meta-label Resumo
              p.meta-value {{ selectedPublication.abstract }}
            
            .publication-keywords-section
              h4.meta-label Palavras-chave
              .keywords-list
                span.keyword(
                  v-for="keyword in selectedPublication.keywords",
                  :key="keyword"
                ) #{{ keyword }}
                
            .modal-actions
              button.btn.btn-primary.btn-lg(
                @click="downloadPublication(selectedPublication)"
              )
                span 📥 Baixar Publicação
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePublicationStore } from '@/stores/publication'
import type { Publication } from '@/types/publication'

const publicationStore = usePublicationStore()

const searchQuery = ref('')
const selectedType = ref('')
const selectedYear = ref('')
const selectedPublication = ref<Publication | null>(null)

onMounted(() => {
  publicationStore.fetchPublications()
})

const filteredPublications = computed(() => {
  let filtered = publicationStore.publications

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.authors.toLowerCase().includes(query) ||
      (item.abstract ?? '').toLowerCase().includes(query) ||
      (item.keywords ?? []).some(keyword => keyword.toLowerCase().includes(query))
    )
  }
  
  if (selectedType.value) {
    filtered = filtered.filter(item => item.type === selectedType.value)
  }
  
  if (selectedYear.value) {
    filtered = filtered.filter(item => item.year.toString() === selectedYear.value)
  }
  
  return filtered
})

// Métodos corrigidos
const filterPublications = () => {
  // Filtragem reativa automática pelo computed
}

const getStatusLabel = (status: Publication['status']): string => {
  const labels: Record<Publication['status'], string> = {
    published: 'Publicado',
    submitted: 'Submetido',
    in_progress: 'Em Andamento'
  }
  return labels[status]
}

const viewPublicationDetails = (publication: Publication) => {
  selectedPublication.value = publication
}

const closePublicationDetails = () => {
  selectedPublication.value = null
}

const downloadPublication = (publication: Publication) => {
  if (publication.fileUrl) {
    alert(`Download iniciado: ${publication.title}`)
  } else {
    alert('Arquivo não disponível para download')
  }
}
</script>


<style scoped lang="scss">
// Variáveis
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
$gray-50: #f9fafb;
$gray-100: #f3f4f6;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$gray-800: #1f2937;
$green-100: #dcfce7;
$green-800: #166534;
$yellow-100: #fef9c3;
$yellow-800: #854d0e;
$blue-100: #dbeafe;
$blue-800: #1e40af;
$focus-ring-color: rgba(29, 138, 159, 0.3);

// Reset
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.publications-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: $gray-800;
  line-height: 1.6;
}

// Container
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

// Hero Section
.hero {
  padding: 6rem 0 5rem;
  background: $primary-gradient;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.4;
  }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 20px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.hero-subtitle {
  font-size: 1.35rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
}

// Filters Section
.filters {
  padding: 2.5rem 0;
  background-color: white;
  border-bottom: 1px solid $gray-200;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.filter-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: stretch;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: center;
  }
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 100%;

  @media (min-width: 1024px) {
    max-width: 400px;
  }

  .search-input {
    width: 100%;
    padding: 0.875rem 1rem;
    border: 2px solid $gray-300;
    border-radius: 0.75rem;
    font-size: 1rem;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: $primary-blue;
      box-shadow: 0 0 0 3px $focus-ring-color;
    }

    &::placeholder {
      color: $gray-400;
    }
  }
}

.filters-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;

  @media (min-width: 640px) {
    flex-direction: row;
  }

  @media (min-width: 1024px) {
    width: auto;
  }
}

.type-filter,
.year-filter {
  flex: 1;
}

.filter-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid $gray-300;
  border-radius: 0.75rem;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px $focus-ring-color;
  }

  &:hover {
    border-color: $gray-400;
  }
}

// Publications List
.publications-list {
  padding: 4rem 0;
  background: linear-gradient(to bottom, $gray-50 0%, white 100%);
  min-height: 60vh;
}

.publications-grid {
  display: grid;
  gap: 2rem;
}

.publication-item {
  background: white;
  padding: 2rem;
  border: 1px solid $gray-200;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(29, 138, 159, 0.15);
    border-color: $primary-blue;
  }
}

.publication-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.publication-info {
  flex: 1;
}

.publication-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.publication-type {
  padding: 0.375rem 1rem;
  background: linear-gradient(135deg, $primary-blue, $light-blue);
  color: white;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(29, 138, 159, 0.2);
}

.publication-year {
  padding: 0.375rem 1rem;
  background-color: $gray-100;
  color: $gray-700;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.publication-status {
  padding: 0.375rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;

  &.status-published {
    background-color: $green-100;
    color: $green-800;
  }

  &.status-submitted {
    background-color: $yellow-100;
    color: $yellow-800;
  }

  &.status-in_progress {
    background-color: $blue-100;
    color: $blue-800;
  }
}

.publication-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $gray-800;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  transition: color 0.2s;

  .publication-item:hover & {
    color: $primary-blue;
  }
}

.publication-authors {
  color: $gray-600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;

  span:first-child {
    font-weight: 600;
    color: $gray-700;
  }
}

.publication-abstract {
  color: $gray-700;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  font-size: 0.975rem;
}

.publication-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.keyword {
  padding: 0.375rem 0.875rem;
  background-color: $gray-100;
  color: $gray-700;
  font-size: 0.875rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: $primary-blue;
    color: white;
    transform: translateY(-1px);
  }
}

.publication-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: 640px) {
    flex-direction: row;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;

  &.btn-primary {
    background: linear-gradient(135deg, $primary-blue, $light-blue);
    color: white;
    box-shadow: 0 2px 8px rgba(29, 138, 159, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(29, 138, 159, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &.btn-outline {
    background-color: white;
    border-color: $primary-blue;
    color: $primary-blue;

    &:hover {
      background-color: $primary-blue;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(29, 138, 159, 0.2);
    }
  }
  
  &.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.05rem;
  }
}

// Modal
.publication-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background-color: white;
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideInUp 0.3s ease-out;
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid $gray-200;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  background: linear-gradient(to bottom, $gray-50, white);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: $gray-800;
  line-height: 1.3;
  flex: 1;
}

.close-button {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  background: $gray-100;
  cursor: pointer;
  font-size: 1.5rem;
  color: $gray-600;
  transition: all 0.2s;
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: $gray-200;
    color: $gray-800;
  }
}

.modal-body {
  padding: 2rem;
}

.publication-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.publication-meta-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.meta-item {
  padding: 1.25rem;
  background-color: $gray-50;
  border-radius: 0.75rem;
  border: 1px solid $gray-200;
}

.meta-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.meta-value {
  color: $gray-700;
  line-height: 1.6;
  font-size: 1rem;
}

.publication-abstract-section,
.publication-keywords-section {
  padding: 1.5rem;
  background-color: $gray-50;
  border-radius: 0.75rem;
  border: 1px solid $gray-200;
}

.keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid $gray-200;
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>