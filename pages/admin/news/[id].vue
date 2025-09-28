<script setup lang="ts">
import { useNewsStore } from '@/stores/news'
import { watchEffect } from 'vue'

const route = useRoute()
const newsStore = useNewsStore()

// 1. Pega o ID da URL e converte para número
const newsId = Number(route.params.id)

// 2. Busca os dados da notícia usando useAsyncData
//    Isso garante que a busca ocorra no servidor (para SEO) e no cliente.
const { data: news, pending, error } = await useAsyncData(
  `news-item-${newsId}`, // Chave única para o cache de dados
  () => newsStore.fetchNewsById(newsId)
)

// 3. Lida com o erro (ex: notícia não encontrada, API offline)
//    Se a API retornar um erro (como 404), 'error.value' será preenchido.
watchEffect(() => {
  if (error.value) {
    // Mostra a página de erro padrão do Nuxt
    showError({ statusCode: 404, statusMessage: 'Notícia não encontrada' })
  }
})

// 4. Define os metadados da página (SEO) dinamicamente
useHead(() => ({
  // Usa uma função para garantir que os dados de 'news' já foram carregados
  title: news.value ? `${news.value.title} - LATECE` : 'Carregando notícia...',
  meta: [
    { 
      name: 'description', 
      content: () => news.value?.excerpt || 'Leia a notícia completa no portal do LATECE.'
    }
  ]
}))

// 5. Função auxiliar para formatar datas
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div>
    <div v-if="pending" class="loading-container">
      <div class="skeleton-header"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-content short"></div>
    </div>

    <article v-else-if="news" class="article-container">
      <header class="article-header">
        <div class="container">
          <NuxtLink to="/news" class="back-link">
          </NuxtLink>
          
          <p class="article-category">{{ news.category }}</p>
          <h1 class="article-title">{{ news.title }}</h1>

          <div class="article-meta">
            <span>Publicado em {{ formatDate(news.createdAt) }}</span>
            <span v-if="news.authorId">• Por Autor #{{ news.authorId }}</span>
          </div>
        </div>
      </header>

      <figure v-if="news.imageUrl" class="featured-image">
        <img :src="news.imageUrl" :alt="news.title" />
      </figure>

      <div class="article-body">
        <div class="container">
          <div class="article-content" v-html="news.content"></div>

          <div v-if="news.tags && news.tags.length > 0" class="article-tags">
            <span v-for="tag in news.tags" :key="tag" class="tag-item">{{ tag }}</span>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Estilos de Carregamento (Skeleton) */
.loading-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
@keyframes skeleton-pulse {
  0% { background-color: #f3f4f6; }
  50% { background-color: #e5e7eb; }
  100% { background-color: #f3f4f6; }
}
.skeleton-header {
  height: 120px;
  width: 100%;
  margin-bottom: 2rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}
.skeleton-content {
  height: 20px;
  width: 100%;
  margin-bottom: 1rem;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
  &.short {
    width: 60%;
  }
}

/* Layout do Artigo */
.article-header {
  padding: 3rem 0;
  text-align: center;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #1D8A9F;
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
  &:hover {
    text-decoration: underline;
  }
}

.article-category {
  color: #1D8A9F;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 1rem;
}

.article-meta {
  color: #4b5563;
  font-size: 0.9rem;
}

.featured-image {
  margin: 0;
  width: 100%;
  max-height: 500px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.article-body {
  padding: 3rem 0;
  background-color: white;
}

.article-content {
  color: #374151;
  font-size: 1.125rem;
  line-height: 1.7;

  /* Estilizando o conteúdo que vem do v-html */
  :deep(h2) {
    font-size: 1.75rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  :deep(p) {
    margin-bottom: 1.5rem;
  }
  
  :deep(ul), :deep(ol) {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  :deep(a) {
    color: #1D8A9F;
    text-decoration: underline;
  }
}

.article-tags {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 2rem;
}

.tag-item {
  background-color: #e5e7eb;
  color: #4b5563;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
}
</style>