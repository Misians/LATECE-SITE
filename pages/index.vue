<template>
  <div class="home-page">
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">{{ $t('home.title') }}</h1>
        <p class="hero-subtitle">{{ $t('home.subtitle') }}</p>
        <p class="hero-description">{{ $t('home.description') }}</p>
        <div class="hero-actions">
          <NuxtLink class="btn btn-secondary btn-lg" to="/about">{{ $t('home.learnMore') }}</NuxtLink>
          <NuxtLink class="btn btn-outline btn-lg" to="/equipment">{{ $t('home.equipment') }}</NuxtLink>
        </div>
      </div>
    </section>

    <section class="mission">
      <div class="container">
        <div class="mission-content">
          <h2 class="section-title">{{ $t('home.mission') }}</h2>
          <p class="mission-text">{{ $t('home.missionText') }}</p>
        </div>
      </div>
    </section>

    <section class="featured-news">
      <div class="container">
        <div class="news-header">
          <h2 class="section-title">{{ $t('home.latestNews') }}</h2>
          <NuxtLink class="btn btn-primary" to="/news">{{ $t('home.viewAll') }}</NuxtLink>
        </div>
        <div class="news-grid">
          <div class="news-card" v-for="news in newsStore.featuredNews" :key="news.id">
            <div class="news-image" v-if="news.imageUrl" :style="{ backgroundImage: `url(${news.imageUrl})` }"></div>
            <div class="news-content">
              <div class="news-meta">
                <span>{{ formatDate(news.publishedAt || news.createdAt) }}</span>
                <span v-if="news.authorName">•</span>
                <span v-if="news.authorName">{{ news.authorName }}</span>
              </div>
              <h3 class="news-title">{{ news.title }}</h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <NuxtLink class="btn btn-outline btn-sm" :to="`/news/${news.id}`">{{ $t('news.readMore') }}</NuxtLink>
            </div>
          </div>
        </div>
        <div class="loading-container" v-if="newsStore.isLoading">
          <div class="loading-spinner"></div>
          <p>{{ $t('common.loading') }}</p>
        </div>
      </div>
    </section>

    <section class="quick-access">
      <div class="container">
        <h2 class="section-title">Acesso Rápido</h2>
        <div class="quick-access-grid">
          <div class="quick-access-card">
            <div class="icon"></div>
            <h3 class="card-title">{{ $t('nav.team') }}</h3>
            <p class="card-description">Conheça nossa equipe de pesquisadores e colaboradores</p>
            <NuxtLink class="btn btn-outline" to="/team">Ver Equipe</NuxtLink>
          </div>
          <div class="quick-access-card">
            <div class="icon"></div>
            <h3 class="card-title">{{ $t('nav.equipment') }}</h3>
            <p class="card-description">Explore nossos equipamentos e recursos de TA</p>
            <NuxtLink class="btn btn-outline" to="/equipment">Ver Equipamentos</NuxtLink>
          </div>
          <div class="quick-access-card">
            <div class="icon"></div>
            <h3 class="card-title">{{ $t('nav.publications') }}</h3>
            <p class="card-description">Acesse nossas publicações e pesquisas</p>
            <NuxtLink class="btn btn-outline" to="/publications">Ver Publicações</NuxtLink>
          </div>
          <div class="quick-access-card">
            <div class="icon"></div>
            <h3 class="card-title">{{ $t('nav.news') }}</h3>
            <p class="card-description">Fique por dentro das últimas notícias</p>
            <NuxtLink class="btn btn-outline" to="/news">Ver Notícias</NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
  
  <script setup lang="ts">
  import { useNewsStore } from '@/stores/news'
  // Meta tags
  useHead({
    title: 'Portal LATECE - Laboratório de Tecnologia Assistiva',
    meta: [
      { name: 'description', content: 'Portal do Laboratório de Tecnologia Assistiva da UFRN' }
    ]
  })
  
  // Stores
  const newsStore = useNewsStore()
  
  // Fetch featured news on mount
  onMounted(() => {
    newsStore.fetchFeaturedNews()
  })
  
  // Utility function to format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '' // <-- CORRIGIDO: Lida com datas indefinidas
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  </script>
  
<style scoped lang="scss">
// Layout base
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Hero Section
.hero {
  background: $primary-gradient;
  color: white;
  padding: 5rem 0;
  text-align: center;
  
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
  
  .hero-description {
    font-size: 1.125rem;
    margin-bottom: 3rem;
    max-width: 48rem;
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    
    @media (min-width: 640px) {
      flex-direction: row;
    }
  }
}

// Mission Section
.mission {
  padding: 4rem 0;
  background: white;
  
  .mission-content {
    max-width: 64rem;
    margin: 0 auto;
    text-align: center;
  }
  
  .mission-text {
    font-size: 1.125rem;
    color: #374151;
    line-height: 1.625;
  }
}

// Featured News Section
.featured-news {
  padding: 4rem 0;
  background: #f9fafb;
  
  .news-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 3rem;
  }
  
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
  
  .news-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all $transition-normal;
    overflow: hidden;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
  }
  
  .news-image {
    height: 12rem;
    background-color: #e5e7eb;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  
  .news-content {
    padding: 1.5rem;
  }
  
  .news-meta {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 0.5rem;
    
    span {
      margin: 0 0.5rem;
    }
  }
  
  .news-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $primary-blue;
    margin-bottom: 0.75rem;
  }
  
  .news-excerpt {
    color: #4b5563;
    margin-bottom: 1rem;
  }
  
  .loading-container {
    text-align: center;
    margin-top: 2rem;
    
    p {
      margin-top: 0.5rem;
      color: #4b5563;
    }
  }
}

// Quick Access Section
.quick-access {
  padding: 4rem 0;
  background: white;
  
  .section-title {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .quick-access-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    
    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  .quick-access-card {
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
    padding: 2rem;
    transition: all $transition-normal;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    .icon {
      width: 4rem;
      height: 4rem;
      background: $primary-blue;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      color: white;
      font-size: 1.5rem;
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: $primary-blue;
      margin-bottom: 0.5rem;
    }
    
    .card-description {
      color: #4b5563;
      margin-bottom: 1rem;
    }
  }
}

// Section Title
.section-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: $primary-blue;
  margin-bottom: 2rem;
  position: relative;
  
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

// Loading Spinner
.loading-spinner {
  display: inline-block;
  width: 2rem;
  height: 2rem;
  border: 4px solid $primary-blue;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>