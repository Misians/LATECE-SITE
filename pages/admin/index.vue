<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <div class="container">
        <div class="header-content">
          <div class="admin-logo">
            <div class="logo-icon">
              <span>L</span>
            </div>
            <div class="admin-title">
              <h1>LATECE Admin</h1>
              <p>Painel de Administração</p>
            </div>
          </div>
          <div class="admin-actions">
            <div class="user-info">
              <div class="user-avatar">
                <span>{{ authStore.userInitials }}</span>
              </div>
              <div class="user-details">
                <p class="user-name">{{ authStore.user?.fullName }}</p>
                <p class="user-role">{{ authStore.user?.role }}</p>
              </div>
            </div>
            <button class="logout-btn" @click="handleLogout">
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="admin-content">
      <aside class="admin-sidebar">
        <div class="sidebar-inner">
          <nav class="admin-nav">
            <NuxtLink class="admin-nav-item" to="/admin" exact-active-class="active">
              <span>Dashboard</span>
            </NuxtLink>
            <NuxtLink class="admin-nav-item" to="/admin/news" active-class="active">
              <span>Notícias</span>
            </NuxtLink>
            <NuxtLink class="admin-nav-item" to="/admin/equipment" active-class="active">
              <span>Equipamentos</span>
            </NuxtLink>
            <NuxtLink class="admin-nav-item" to="/admin/publications" active-class="active">
              <span>Publicações</span>
            </NuxtLink>
            <NuxtLink class="admin-nav-item" to="/admin/team" active-class="active">
              <span>Equipe</span>
            </NuxtLink>
            <div class="admin-nav-divider"></div>
            <NuxtLink class="admin-nav-item" to="/admin/settings" active-class="active">
              <span>Configurações</span>
            </NuxtLink>
          </nav>
        </div>
      </aside>

      <main class="admin-main">
        <section class="dashboard-stats">
          <div class="stat-card">
            <div class="stat-icon icon-blue"></div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.news }}</h3>
              <p class="stat-label">Total de Notícias</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-green"></div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.equipment }}</h3>
              <p class="stat-label">Equipamentos</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-purple"></div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.publications }}</h3>
              <p class="stat-label">Publicações</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon icon-orange"></div>
            <div class="stat-content">
              <h3 class="stat-number">{{ stats.team }}</h3>
              <p class="stat-label">Membros da Equipe</p>
            </div>
          </div>
        </section>

        <div class="main-content-grid">
          <section class="recent-activity">
            <header class="activity-header">
              <h2 class="activity-title">Atividade Recente</h2>
            </header>
            <div class="activity-content">
              <ul class="activity-list">
                <li class="activity-item" v-for="activity in recentActivity" :key="activity.id">
                  <div class="activity-icon"></div>
                  <div class="activity-details">
                    <p class="activity-text">{{ activity.text }}</p>
                    <p class="activity-time">{{ formatTime(activity.createdAt) }}</p>
                  </div>
                </li>
              </ul>
              <div class="activity-empty" v-if="recentActivity.length === 0">
                <p>Nenhuma atividade recente</p>
              </div>
            </div>
          </section>

          <section class="quick-actions">
            <h2 class="quick-actions-title">Ações Rápidas</h2>
            <div class="quick-actions-grid">
              <NuxtLink class="quick-action-card" to="/admin/news/create">
                <div class="quick-action-icon icon-blue"></div>
                <h3 class="quick-action-title">Nova Notícia</h3>
                <p class="quick-action-description">Criar uma nova notícia ou evento</p>
              </NuxtLink>
              <NuxtLink class="quick-action-card" to="/admin/equipment/create">
                <div class="quick-action-icon icon-green"></div>
                <h3 class="quick-action-title">Novo Equipamento</h3>
                <p class="quick-action-description">Adicionar equipamento ao catálogo</p>
              </NuxtLink>
              <NuxtLink class="quick-action-card" to="/admin/publications/create">
                <div class="quick-action-icon icon-purple"></div>
                <h3 class="quick-action-title">Nova Publicação</h3>
                <p class="quick-action-description">Adicionar publicação ao repositório</p>
              </NuxtLink>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

// Meta tags
useHead({
  title: 'Painel Administrativo - LATECE',
  meta: [
    { name: 'description', content: 'Painel de administração do Portal LATECE' }
  ]
})

// Middleware
definePageMeta({
  middleware: 'auth'
})

// Stores
const authStore = useAuthStore()

// Reactive data
const stats = ref({
  news: 0,
  equipment: 0,
  publications: 0,
  team: 0
})

const recentActivity = ref([
  {
    id: 1,
    icon: 'newspaper',
    text: 'Nova notícia "Workshop de Tecnologia Assistiva" foi publicada',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 2,
    icon: 'cog',
    text: 'Equipamento "Impressora Braille" foi adicionado ao catálogo',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: 3,
    icon: 'book',
    text: 'Nova publicação "Acessibilidade Digital" foi adicionada',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  }
])

// Methods
const handleLogout = async () => {
  await authStore.logout()
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor(diff / (1000 * 60))
  
  if (hours > 0) {
    return `há ${hours}h`
  } else if (minutes > 0) {
    return `há ${minutes}min`
  } else {
    return 'agora'
  }
}

// Fetch stats on mount
onMounted(async () => {
  // TODO: Implement actual stats fetching from API
  stats.value = {
    news: 12,
    equipment: 8,
    publications: 25,
    team: 6
  }
})
</script>

<style scoped>
/* ================================ */
/* Base Layout */
/* ================================ */
.admin-dashboard {
  min-height: 100vh;
  background-color: #f9fafb;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

.admin-content {
  display: flex;
}

/* ================================ */
/* Header */
/* ================================ */
.admin-header {
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border-bottom: 1px solid #e5e7eb;
}

.admin-header .header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

.admin-header .admin-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-header .logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #005A9C, #4D9DE0);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.125rem;
}

.admin-header .admin-title h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #005A9C;
}

.admin-header .admin-title p {
  font-size: 0.875rem;
  color: #4b5563;
}

.admin-header .admin-actions, 
.admin-header .user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-header .user-avatar {
  width: 2rem;
  height: 2rem;
  background-color: #005A9C;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
}

.admin-header .user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.admin-header .user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

.admin-header .logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  background: none;
  border: none;
  cursor: pointer;
}

.admin-header .logout-btn:hover {
  color: #dc2626;
  background-color: #fef2f2;
}

/* ================================ */
/* Sidebar */
/* ================================ */
.admin-sidebar {
  width: 16rem;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
}

.admin-sidebar .sidebar-inner {
  padding: 1rem;
}

.admin-sidebar .admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.admin-sidebar .admin-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  color: #374151;
}

.admin-sidebar .admin-nav-item:hover {
  background-color: #f3f4f6;
  color: #005A9C;
}

.admin-sidebar .admin-nav-item.active {
  background-color: #005A9C;
  color: #ffffff;
}

.admin-sidebar .admin-nav-item.active:hover {
  background-color: #004b80; /* Cor darkend(5%) */
}

.admin-sidebar .admin-nav-divider {
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
}

/* ================================ */
/* Main Content */
/* ================================ */
.admin-main {
  flex: 1;
  padding: 2rem;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 0.875rem;
  color: #4b5563;
}

/* Recent Activity & Quick Actions */
.main-content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.recent-activity {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.activity-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.activity-content {
  padding: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 0.875rem;
  color: #111827;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-empty {
  text-align: center;
  padding: 2rem 0;
}

.activity-empty p {
  color: #6b7280;
}

.quick-actions-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

.quick-action-card {
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  transition: all 0.3s ease-in-out;
  text-decoration: none;
  color: inherit;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.quick-action-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.quick-action-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.quick-action-description {
  font-size: 0.875rem;
  color: #4b5563;
}

/* Icon Background Colors */
.icon-blue { background-color: #dbeafe; }
.icon-green { background-color: #dcfce7; }
.icon-purple { background-color: #f3e8ff; }
.icon-orange { background-color: #ffedd5; }

/* ================================ */
/* Responsive Design */
/* ================================ */
@media (min-width: 768px) {
  .dashboard-stats, 
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .dashboard-stats {
    grid-template-columns: repeat(4, 1fr);
  }
  .main-content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>