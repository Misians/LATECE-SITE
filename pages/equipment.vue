<template lang="pug">
.equipment-page
  // Hero Section
  section.hero
    .hero-content
      h1.hero-title Equipamentos de Tecnologia Assistiva
      p.hero-subtitle Explore nossos recursos e tecnologias para acessibilidade
  
  // Filter and Search Section
  section.filters
    .container
      .filter-wrapper
        // Search
        .search-box
          svg.search-icon(width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24")
            path(stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z")
          input.search-input(
            v-model="searchQuery"
            placeholder="Buscar equipamento..."
            @input="filterEquipment"
          )
        
        // Category Filter
        select.filter-select(v-model="selectedCategory" @change="filterEquipment")
          option(value="") Todas as Categorias
          option(value="Comunicação") Comunicação
          option(value="Mobilidade") Mobilidade
          option(value="Visual") Visual
          option(value="Auditivo") Auditivo
          option(value="Computação") Computação
  
  // Equipment Grid Section
  section.equipment-grid
    .container
      // Empty state
      .empty-state(v-if="filteredEquipment.length === 0")
        .empty-icon 🔍
        h3.empty-title Nenhum equipamento encontrado
        p.empty-subtitle Tente ajustar os filtros de busca
      
      // Equipment Grid
      .grid-container(v-else)
        .equipment-card(
          v-for="equipment in filteredEquipment"
          :key="equipment.id"
        )
          .equipment-image
            img(
              v-if="equipment.imageUrl"
              :src="equipment.imageUrl"
              :alt="equipment.name"
            )
            .image-placeholder(v-else) 📦
            .equipment-category {{ equipment.category }}
          
          .equipment-content
            h3.equipment-name {{ equipment.name }}
            p.equipment-description {{ equipment.description }}
            
            .equipment-details
              .detail-item
                | 📍 {{ equipment.location }}
            
            .equipment-actions
              button.btn(@click="viewEquipmentDetails(equipment)") Ver Detalhes
              .equipment-status(:class="`status-${equipment.status}`")
                .status-dot
                span {{ getStatusText(equipment.status) }}

  // Equipment Details Modal
  .modal(v-if="selectedEquipment" @click.self="closeEquipmentDetails")
    .modal-content
      .modal-header
        h3.modal-title {{ selectedEquipment.name }}
        button.close-button(@click="closeEquipmentDetails") ✕
      
      .modal-body
        .modal-image(v-if="selectedEquipment.imageUrl")
          img(:src="selectedEquipment.imageUrl" :alt="selectedEquipment.name")
        
        .equipment-info
          .info-item
            .info-label 📝 Descrição
            .info-value {{ selectedEquipment.description }}
          
          .info-item
            .info-label ⚙️ Especificações
            .info-value {{ selectedEquipment.specifications }}
          
          .info-item
            .info-label 📍 Localização
            .info-value {{ selectedEquipment.location }}
          
          .info-item
            .info-label 🔔 Status
            .info-value.equipment-status(:class="`status-${selectedEquipment.status}`")
              .status-dot
              span {{ getStatusText(selectedEquipment.status) }}
          
          .info-item
            .info-label 💡 Observações
            .info-value {{ selectedEquipment.notes }}
</template>

<script setup lang="ts">
import { useEquipmentStore } from '@/stores/equipment'
import type { Equipment } from '@/types/equipment'

// Meta tags
useHead({
  title: 'Equipamentos - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Explore os equipamentos e recursos de Tecnologia Assistiva disponíveis no LATECE' }
  ]
})

const equipmentStore = useEquipmentStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedEquipment = ref<Equipment | null>(null)

// Busca equipamentos do backend ao montar a página
onMounted(() => {
  equipmentStore.fetchEquipment()
})

const filteredEquipment = computed(() => {
  let list = equipmentStore.equipment

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  if (selectedCategory.value) {
    list = list.filter(item => item.category === selectedCategory.value)
  }

  return list
})

const filterEquipment = () => {
  // A filtragem é reativa via computed
}

const viewEquipmentDetails = (equipment: Equipment) => {
  selectedEquipment.value = equipment
}

const closeEquipmentDetails = () => {
  selectedEquipment.value = null
}

const getStatusText = (status: Equipment['status']) => {
  const statusMap: Record<Equipment['status'], string> = {
    available: 'Disponível',
    in_use: 'Em uso',
    maintenance: 'Manutenção',
    unavailable: 'Indisponível',
  }
  return statusMap[status]
}
</script>

<style scoped lang="scss">
// Variáveis
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);

// Reset e Container
.equipment-page {
  background: #f9fafb;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Hero Section
.hero {
  background: $primary-gradient;
  padding: 5rem 1rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat bottom;
    background-size: cover;
    opacity: 0.3;
  }
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 1rem;
  animation: fadeInDown 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

// Filters Section
.filters {
  background: white;
  padding: 2rem 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.filter-wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.search-box {
  flex: 1;
  min-width: 250px;
  max-width: 400px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px rgba(29, 138, 159, 0.1);
  }
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: $primary-blue;
    box-shadow: 0 0 0 3px rgba(29, 138, 159, 0.1);
  }
}

// Equipment Grid
.equipment-grid {
  padding: 4rem 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.equipment-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.5s ease-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px rgba(0,0,0,0.15);

    .equipment-image img {
      transform: scale(1.1);
    }
  }
}

.equipment-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 4rem;
  color: rgba(255,255,255,0.3);
}

.equipment-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255,255,255,0.95);
  color: $primary-blue;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.equipment-content {
  padding: 1.5rem;
}

.equipment-name {
  font-size: 1.4rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 0.75rem;
}

.equipment-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.equipment-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.equipment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid $primary-blue;
  background: transparent;
  color: $primary-blue;

  &:hover {
    background: $primary-blue;
    color: white;
    transform: translateY(-2px);
  }
}

.equipment-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  &.status-available {
    color: #16a34a;
    .status-dot { background: #16a34a; }
  }

  &.status-in-use {
    color: #ca8a04;
    .status-dot { background: #ca8a04; }
  }

  &.status-maintenance {
    color: #dc2626;
    .status-dot { background: #dc2626; }
  }
}

// Empty State
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: #6b7280;
}

// Modal
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: fadeIn 0.3s;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s;
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
}

.modal-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: $primary-blue;
}

.close-button {
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 1.5rem;

  &:hover {
    background: #e5e7eb;
    transform: rotate(90deg);
  }
}

.modal-body {
  padding: 2rem;
}

.modal-image {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  animation: fadeIn 0.5s ease-out;
}

.info-label {
  font-size: 1.1rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-value {
  color: #374151;
  line-height: 1.7;
}

// Animations
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>