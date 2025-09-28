<template lang="pug">
  .equipment-page
    // Hero Section
    section.hero
      .container
        h1.hero-title {{ $t('equipment.title') }}
        p.hero-subtitle {{ $t('equipment.subtitle') }}
    
    // Filter and Search Section
    section.filters
      .container
        .filter-wrapper
          // Search
          .search-box
            input.search-input(
              v-model="searchQuery",
              :placeholder="$t('equipment.searchPlaceholder')",
              @input="filterEquipment"
            )
          
          // Category Filter
          .category-filter
            select.filter-select(v-model="selectedCategory", @change="filterEquipment")
              option(value="") {{ $t('equipment.allCategories') }}
              option(
                v-for="category in equipmentStore.categories",
                :key="category",
                :value="category"
              ) {{ category }}
    
    // Equipment Grid Section
    section.equipment-grid
      .container
        // Loading state
        .state-indicator(v-if="equipmentStore.isLoading")
          .loading-spinner
          p {{ $t('common.loading') }}
        
        // Empty state
        .state-indicator(v-else-if="filteredEquipment.length === 0")
          p.empty-title {{ $t('equipment.noEquipment') }}
          p.empty-subtitle {{ $t('equipment.tryDifferentSearch') }}
        
        // Equipment Grid
        .grid-container(v-else)
          .equipment-card(
            v-for="equipment in filteredEquipment",
            :key="equipment.id"
          )
            .equipment-image
              img(v-if="equipment.imageUrl", :src="equipment.imageUrl", :alt="equipment.name")
              .image-placeholder(v-else)
              .equipment-category {{ equipment.category }}
            
            .equipment-content
              h3.equipment-name {{ equipment.name }}
              p.equipment-description {{ equipment.description }}
              
              .equipment-details
                .detail-item(v-if="equipment.location")
                  span {{ equipment.location }}
                
                .detail-item(v-if="equipment.status")
                  span {{ getStatusText(equipment.status) }}
              
              .equipment-actions
                button.btn.btn-outline(@click="viewEquipmentDetails(equipment)") {{ $t('equipment.viewDetails') }}
                .equipment-status(:class="getStatusClass(equipment.status)")
                  .status-dot
                  span.status-text {{ getStatusText(equipment.status) }}
  
    // Equipment Details Modal
    .equipment-modal(v-if="selectedEquipment", @click.self="closeEquipmentDetails")
      .modal-content
        .modal-header
          h3.modal-title {{ selectedEquipment.name }}
          button.close-button(@click="closeEquipmentDetails", :aria-label="$t('common.close')")
        
        .modal-body
          .modal-image(v-if="selectedEquipment.imageUrl")
            img(:src="selectedEquipment.imageUrl", :alt="selectedEquipment.name")
          
          .equipment-info
            .info-item
              h4.info-label {{ $t('equipment.description') }}
              p.info-value {{ selectedEquipment.description }}
            
            .info-item(v-if="selectedEquipment.specifications")
              h4.info-label {{ $t('equipment.specifications') }}
              p.info-value {{ selectedEquipment.specifications }}
            
            .info-item(v-if="selectedEquipment.location")
              h4.info-label {{ $t('equipment.location') }}
              p.info-value {{ selectedEquipment.location }}
            
            .info-item(v-if="selectedEquipment.status")
              h4.info-label {{ $t('equipment.status') }}
              p.info-value {{ getStatusText(selectedEquipment.status) }}
            
            .info-item(v-if="selectedEquipment.notes")
              h4.info-label {{ $t('equipment.notes') }}
              p.info-value {{ selectedEquipment.notes }}
  </template>
<script setup lang="ts">
import { useEquipmentStore } from '@/stores/equipment'
// Meta tags
useHead({
  title: 'Equipamentos - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Explore os equipamentos e recursos de Tecnologia Assistiva disponíveis no LATECE' }
  ]
})

// Stores
const equipmentStore = useEquipmentStore()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedEquipment = ref(null)

// Computed properties
const filteredEquipment = computed(() => {
  let equipment = equipmentStore.equipment
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    equipment = equipment.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }
  
  // Filter by category
  if (selectedCategory.value) {
    equipment = equipment.filter(item => item.category === selectedCategory.value)
  }
  
  return equipment
})

// Methods
const filterEquipment = () => {
  // Filtering is handled by computed property
}

const viewEquipmentDetails = (equipment: any) => {
  selectedEquipment.value = equipment
}

const closeEquipmentDetails = () => {
  selectedEquipment.value = null
}

const getStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'text-green-600'
    case 'in use':
      return 'text-yellow-600'
    case 'maintenance':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'Disponível'
    case 'in use':
      return 'Em uso'
    case 'maintenance':
      return 'Manutenção'
    default:
      return status || 'Indisponível'
  }
}

// Fetch equipment on mount
onMounted(async () => {
  await equipmentStore.fetchEquipment()
  await equipmentStore.fetchCategories()
})
</script>

<style scoped lang="scss">
// Variáveis (ajuste conforme seu design system)
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(to bottom right, $primary-blue, $light-blue);
$gray-50: #f9fafb;
$gray-200: #e5e7eb;
$gray-300: #d1d5db;
$gray-400: #9ca3af;
$gray-500: #6b7280;
$gray-600: #4b5563;
$gray-700: #374151;
$green-600: #16a34a;
$yellow-600: #ca8a04;
$red-600: #dc2626;
$focus-ring-color: rgba(29, 138, 159, 0.4);

// Mixin para botões
@mixin btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem; // btn-sm
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;

  &.btn-outline {
    background-color: transparent;
    border-color: $primary-blue;
    color: $primary-blue;
    &:hover { background-color: $primary-blue; color: white; }
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
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

// Seção de Filtros (similar à página de publicações)
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
  @media (min-width: 768px) { flex-direction: row; }
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 28rem;
  width: 100%;
  .search-input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid $gray-300;
    border-radius: 0.5rem;
    &:focus { outline: none; box-shadow: 0 0 0 2px $focus-ring-color; }
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

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid $gray-300;
  border-radius: 0.5rem;
  width: 100%;
  &:focus { outline: none; box-shadow: 0 0 0 2px $focus-ring-color; }
}

// Grid de Equipamentos
.equipment-grid {
  padding: 4rem 0;
  background-color: white;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
}

.equipment-card {
  border: 1px solid $gray-200;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  &:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
}

.equipment-image {
  position: relative;
  height: 12rem; // h-48
  background-color: $gray-200;
  overflow: hidden;
  transition: transform 0.3s ease-in-out;
  .equipment-card:hover & { transform: scale(1.05); }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  :deep(svg) { width: 4rem; height: 4rem; color: $gray-400; }
}

.equipment-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: $primary-blue;
  color: white;
  font-size: 0.875rem;
  border-radius: 9999px;
}

.equipment-content {
  padding: 1.5rem;
}

.equipment-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: $primary-blue;
  margin-bottom: 0.5rem;
}

.equipment-description {
  color: $gray-600;
  margin-bottom: 1rem;
  // Limita o texto a 3 linhas com reticências
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.equipment-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: $gray-500;
  :deep(svg) { width: 1rem; height: 1rem; margin-right: 0.5rem; }
}

.equipment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .btn { @include btn; }
}

.equipment-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;

  .status-dot { width: 0.5rem; height: 0.5rem; border-radius: 50%; }

  &.status-available { color: $green-600; .status-dot { background-color: $green-600; } }
  &.status-in-use { color: $yellow-600; .status-dot { background-color: $yellow-600; } }
  &.status-maintenance { color: $red-600; .status-dot { background-color: $red-600; } }
  &.status-other { color: $gray-600; .status-dot { background-color: $gray-600; } }
}

// Estados de Loading e Vazio (similar a outras páginas)
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
  :deep(svg) { width: 4rem; height: 4rem; color: $gray-400; margin: 0 auto 1rem; }
  .empty-title { font-size: 1.125rem; margin-bottom: 1rem; }
  .empty-subtitle { color: $gray-500; }
}

// Modal (similar a outras páginas)
.equipment-modal {
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
  max-width: 42rem; // max-w-2xl
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
  &:hover { background-color: #f3f4f6; }
  :deep(svg) { width: 1.5rem; height: 1.5rem; }
}

.modal-body {
  padding: 1.5rem;
}

.modal-image {
  margin-bottom: 1.5rem;
  img {
    width: 100%;
    height: 16rem; // h-64
    object-fit: cover;
    border-radius: 0.5rem;
  }
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-label {
  font-size: 1.125rem;
  font-weight: 600;
  color: $primary-blue;
  margin-bottom: 0.5rem;
}

.info-value {
  color: $gray-700;
  line-height: 1.6;
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