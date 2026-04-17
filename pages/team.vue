<template lang="pug">
.team-page
  // Hero Section
  section.hero
    .hero-content
      h1.hero-title Nossa Equipe
      p.hero-subtitle Conheça os profissionais dedicados à Tecnologia Assistiva

  // Team Members Section
  section.team-members
    .container
      // Coordinators
      .coordinators(v-if="coordinators.length > 0")
        h2.section-title Coordenadores
        .members-grid
          .member-card(v-for="member in coordinators" :key="member.id")
            .member-photo
              img(v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name")
              .initials-placeholder(v-else) {{ getInitials(member.name) }}
            h3.member-name {{ member.name }}
            p.member-role {{ member.role }}
            p.member-bio {{ member.bio }}
            .member-links
              a.member-link(
                v-if="member.email"
                :href="`mailto:${member.email}`"
                :aria-label="`Enviar email para ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
              a.member-link(
                v-if="member.lattesUrl"
                :href="member.lattesUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Ver currículo Lattes de ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z")
              a.member-link(
                v-if="member.linkedinUrl"
                :href="member.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Ver LinkedIn de ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z")

      // Collaborators
      .collaborators(v-if="collaborators.length > 0")
        h2.section-title Colaboradores
        .members-grid
          .member-card.collaborator-card(v-for="member in collaborators" :key="member.id")
            .member-photo
              img(v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name")
              .initials-placeholder(v-else) {{ getInitials(member.name) }}
            h3.member-name {{ member.name }}
            p.member-role {{ member.role }}
            p.member-bio {{ member.bio }}
            .member-links
              a.member-link(
                v-if="member.email"
                :href="`mailto:${member.email}`"
                :aria-label="`Enviar email para ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
              a.member-link(
                v-if="member.lattesUrl"
                :href="member.lattesUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Ver currículo Lattes de ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z")
              a.member-link(
                v-if="member.linkedinUrl"
                :href="member.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Ver LinkedIn de ${member.name}`"
              )
                svg(width="24" height="24" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z")

      // Students
      .students(v-if="students.length > 0")
        h2.section-title Estudantes
        .members-grid.students-grid
          .member-card.student-card(v-for="member in students" :key="member.id")
            .member-photo
              img(v-if="member.photoUrl" :src="member.photoUrl" :alt="member.name")
              .initials-placeholder(v-else) {{ getInitials(member.name) }}
            h3.member-name {{ member.name }}
            p.member-role {{ member.role }}
            .member-links
              a.member-link(
                v-if="member.email"
                :href="`mailto:${member.email}`"
                :aria-label="`Enviar email para ${member.name}`"
              )
                svg(width="20" height="20" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z")
              a.member-link(
                v-if="member.linkedinUrl"
                :href="member.linkedinUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Ver LinkedIn de ${member.name}`"
              )
                svg(width="20" height="20" fill="currentColor" viewBox="0 0 24 24")
                  path(d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z")

      // Empty State
      .empty-state(v-if="allMembers.length === 0")
        .empty-icon 👥
        h3.empty-title Nenhum membro cadastrado
        p.empty-subtitle A equipe será atualizada em breve
</template>

<script setup lang="ts">
import { useTeamStore } from '@/stores/team'
import type { TeamMember } from '@/types/team'

useHead({
  title: 'Equipe - Laboratório de Tecnologia Assistiva',
  meta: [
    { name: 'description', content: 'Conheça a equipe do Laboratório de Tecnologia Assistiva da UFRN' }
  ]
})

const teamStore = useTeamStore()

onMounted(() => {
  teamStore.fetchMembers()
})

const coordinators = computed(() =>
  teamStore.members.filter(member => member.role === 'coordinator')
)

const collaborators = computed(() =>
  teamStore.members.filter(member => ['researcher', 'technician', 'collaborator'].includes(member.role))
)

const students = computed(() =>
  teamStore.members.filter(member => member.role === 'student')
)

const allMembers = computed<TeamMember[]>(() => teamStore.members)

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
// Variáveis
$primary-blue: #1D8A9F;
$light-blue: #64B8D1;
$primary-gradient: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
$gray-50: #f9fafb;
$gray-200: #e5e7eb;
$gray-400: #9ca3af;
$gray-600: #4b5563;
$gray-700: #374151;

// Container
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
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

// Team Members Section
.team-members {
  padding: 4rem 0;
  background: $gray-50;
}

.coordinators,
.collaborators,
.students {
  margin-bottom: 4rem;

  &:last-child {
    margin-bottom: 0;
  }
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
    width: 80px;
    height: 4px;
    background: $primary-gradient;
    border-radius: 2px;
  }
}

.members-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  &.students-grid {
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.member-card {
  background: white;
  padding: 2rem 1.5rem;
  text-align: center;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeIn 0.5s ease-out;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 25px rgba(0,0,0,0.15);
  }

  &.collaborator-card .member-photo {
    width: 7rem;
    height: 7rem;
  }

  &.collaborator-card .initials-placeholder {
    font-size: 1.75rem;
  }

  &.student-card .member-photo {
    width: 5rem;
    height: 5rem;
  }

  &.student-card .initials-placeholder {
    font-size: 1.25rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.student-card .member-name {
    font-size: 1rem;
  }

  &.student-card .member-role {
    font-size: 0.875rem;
  }
}

.member-photo {
  width: 9rem;
  height: 9rem;
  background: $gray-200;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  overflow: hidden;
  transition: transform 0.3s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

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
  background: $primary-gradient;
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
}

.member-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 0.5rem;
}

.member-role {
  font-size: 1rem;
  color: $light-blue;
  font-weight: 600;
  margin-bottom: 1rem;
}

.member-bio {
  color: $gray-600;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.member-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.member-link {
  color: $primary-blue;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $gray-50;

  &:hover {
    color: white;
    background: $primary-gradient;
    transform: translateY(-3px);
  }

  svg {
    width: 24px;
    height: 24px;
  }
}

// Empty State
.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $gray-700;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  color: $gray-600;
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
</style>