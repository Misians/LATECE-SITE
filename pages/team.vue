<template>
  <div class="team-page">
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">{{ $t('team.title') }}</h1>
        <p class="hero-subtitle">{{ $t('team.subtitle') }}</p>
      </div>
    </section>

    <section class="team-members">
      <div class="container">
        <div class="coordinators" v-if="coordinators.length > 0">
          <h2 class="section-title">{{ $t('team.coordinators') }}</h2>
          <div class="members-grid">
            <div class="member-card" v-for="member in coordinators" :key="member.id">
              <div class="member-photo">
                <img v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name" />
                <div class="initials-placeholder" v-else>{{ getInitials(member.name) }}</div>
              </div>
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="member-links">
                <a class="member-link" v-if="member.email" :href="`mailto:${member.email}`" :aria-label="`Enviar email para ${member.name}`">
                  <Icon name="mdi:email" />
                </a>
                <a class="member-link" v-if="member.lattesUrl" :href="member.lattesUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Ver currículo Lattes de ${member.name}`">
                  <Icon name="academicons:lattes" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="collaborators" v-if="collaborators.length > 0">
          <h2 class="section-title">{{ $t('team.collaborators') }}</h2>
          <div class="members-grid">
            <div class="member-card collaborator-card" v-for="member in collaborators" :key="member.id">
              <div class="member-photo">
                <img v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name" />
                <div class="initials-placeholder" v-else>{{ getInitials(member.name) }}</div>
              </div>
              <h3 class="member-name">{{ member.name }}</h3>
              <p class="member-role">{{ member.role }}</p>
              <p class="member-bio">{{ member.bio }}</p>
              <div class="member-links">
                <a class="member-link" v-if="member.email" :href="`mailto:${member.email}`" :aria-label="`Enviar email para ${member.name}`">
                  <Icon name="mdi:email" />
                </a>
                <a class="member-link" v-if="member.lattesUrl" :href="member.lattesUrl" target="_blank" rel="noopener noreferrer" :aria-label="`Ver currículo Lattes de ${member.name}`">
                  <Icon name="academicons:lattes" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="state-indicator" v-if="teamStore.isLoading">
          <div class="loading-spinner"></div>
          <p>{{ $t('common.loading', 'Carregando...') }}</p>
        </div>

        <div class="state-indicator" v-else-if="!teamStore.hasMembers">
          <p>{{ $t('team.noMembers') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import { computed, onMounted } from 'vue'

// Meta tags
useHead({
  title: 'Equipe - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Conheça a equipe do Laboratório de Tecnologia Assistiva da UFRN' }
  ]
})

// Stores
const teamStore = useTeamStore()

// Fetch team members on mount
onMounted(() => {
  teamStore.fetchMembers()
})

// Use the getters directly from your Pinia store
const coordinators = computed(() => teamStore.coordinators)
const collaborators = computed(() => teamStore.collaborators)

// Helper function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return ''
  const names = name.split(' ').filter(Boolean)
  if (names.length > 1) {
    const firstInitial = names[0]?.[0] ?? ''
    const lastInitial = names[names.length - 1]?.[0] ?? ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
</script>

<style scoped lang="scss">
// Variáveis (ajuste conforme seu design system)
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(to bottom right, $primary-blue, $light-blue);
$gray-200: #e5e7eb;
$gray-600: #4b5563;
$gray-400: #9ca3af;
$gray-700: #374151;
$transition-normal: all 0.3s ease-in-out;
$transition-fast: all 0.2s ease-in-out;

// Estilos Gerais
.container {
  width: 100%;
  max-width: 72rem;
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
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

// Seção de Membros
.team-members {
  padding: 4rem 0;
  background-color: white;
}

.coordinators {
  margin-bottom: 4rem;
}

.section-title {
  position: relative;
  font-size: 1.875rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 3rem;
  text-align: center;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: $primary-gradient;
    border-radius: 2px;
  }
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @media (min-width: 768px) { // md
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) { // lg
    grid-template-columns: repeat(3, 1fr);
  }
}

.member-card {
  padding: 1.5rem;
  text-align: center;
  border: 1px solid $gray-200;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1);
  transition: $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
  }

  &.collaborator-card .member-photo {
    width: 6rem;
    height: 6rem;
  }
  
  &.collaborator-card .initials-placeholder {
    font-size: 1.5rem;
    background-color: $light-blue;
  }
}

.member-photo {
  width: 8rem;
  height: 8rem;
  background-color: $gray-200;
  border-radius: 9999px;
  margin: 0 auto 1rem;
  overflow: hidden;
  transition: transform $transition-normal;

  .member-card:hover & {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.initials-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: $primary-blue;
  color: white;
  font-size: 2.25rem;
  font-weight: 700;
}

.member-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: $primary-blue;
  margin-bottom: 0.5rem;
}

.member-role {
  font-size: 1rem;
  color: $light-blue;
  margin-bottom: 0.75rem;
}

.member-bio {
  color: $gray-600;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.member-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.member-link {
  color: $primary-blue;
  transition: $transition-fast;
  display: inline-block;

  &:hover {
    color: $light-blue;
    transform: scale(1.1);
  }

  :deep(.icon) {
    font-size: 1.5rem;
  }
}

// Estados de Loading e Vazio
.state-indicator {
  text-align: center;
  margin-top: 2rem;
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

  p {
    margin-top: 0.5rem;
    color: $gray-600;
  }
}

// Animações
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>