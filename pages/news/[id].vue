<template>
  <main class="article-page">
    <div v-if="isLoading" class="loading-container">
      <p>Carregando notícia...</p>
    </div>

    <article v-else-if="newsItem" class="article-container">
      <header class="article-header">
        <NuxtLink to="/noticias" class="back-link">
          <Icon name="mdi:arrow-left" /> Voltar para Notícias
        </NuxtLink>
        <p class="category-tag">{{ newsItem.category }}</p>
        <h1 class="article-title">{{ newsItem.title }}</h1>
        <p v-if="newsItem.excerpt" class="article-excerpt">{{ newsItem.excerpt }}</p>

        <div class="article-meta">
          <div class="author-info">
            <Icon name="mdi:account-circle-outline" class="author-avatar" />
            <div class="author-details">
              <span class="author-name">{{ newsItem.authorId || 'Autor Desconhecido' }}</span>
              <span class="publish-date">Publicado em {{ formatDate(newsItem.updatedAt || newsItem.createdAt) }}</span>
            </div>
          </div>
          
        </div>
      </header>

      <figure v-if="newsItem.imageUrl" class="featured-image-container">
        <img :src="newsItem.imageUrl" :alt="newsItem.title" />
      </figure>

      <div class="article-content" v-html="newsItem.content"></div>

      <footer class="article-footer">
        <div v-if="newsItem.tags && newsItem.tags.length > 0" class="tags-section">
          <strong>Tags:</strong>
          <span v-for="tag in newsItem.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>

        <div class="share-section">
          <strong>Compartilhar:</strong>
          <div class="share-links">
            <a :href="twitterShareUrl" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Twitter">
              <Icon name="mdi:twitter" />
            </a>
            <a :href="facebookShareUrl" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook">
              <Icon name="mdi:facebook" />
            </a>
            <a :href="linkedinShareUrl" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn">
              <Icon name="mdi:linkedin" />
            </a>
            <a :href="whatsappShareUrl" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp">
              <Icon name="mdi:whatsapp" />
            </a>
          </div>
        </div>
      </footer>

    </article>

    <div v-else class="not-found-container">
      <h2>Notícia não encontrada</h2>
      <p>A notícia que você está procurando não existe ou foi removida.</p>
      <NuxtLink to="/noticias">Voltar para a lista de notícias</NuxtLink>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useNewsStore } from '~/stores/news';
import { useRoute, useAsyncData, createError, useHead, useRequestURL } from '#imports';

// --- INICIALIZAÇÃO E BUSCA DE DADOS (LÓGICA EXISTENTE) ---
const route = useRoute();
const newsStore = useNewsStore();
const id = route.params.id as string;
const numericId = Number(id);

const { data: newsItem, pending: isLoading } = await useAsyncData(
  `news-item-${numericId}`,
  () => newsStore.fetchNewsById(numericId)
);

if (!newsItem.value) {
  throw createError({ statusCode: 404, statusMessage: 'Página não encontrada', fatal: true });
}

// --- MELHORIA 1: FUNÇÕES AUXILIARES ---
function formatDate(dateString: string | undefined) {
  if (!dateString) return 'Data indisponível';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// --- MELHORIA 2: LÓGICA DE COMPARTILHAMENTO ---
const pageUrl = useRequestURL().href; // Pega a URL completa da página
const shareText = computed(() => encodeURIComponent(newsItem.value?.title || ''));

const twitterShareUrl = computed(() => `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareText.value}`);
const facebookShareUrl = computed(() => `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
const linkedinShareUrl = computed(() => `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${shareText.value}`);
const whatsappShareUrl = computed(() => `https://api.whatsapp.com/send?text=${shareText.value}%20${pageUrl}`);

// --- MELHORIA 3: SEO AVANÇADO COM OPEN GRAPH ---
useHead(() => ({
  title: newsItem.value?.title || 'Notícia',
  meta: [
    { name: 'description', content: newsItem.value?.excerpt || 'Leia mais sobre esta notícia.' },
    // Open Graph (para Facebook, LinkedIn, etc.)
    { property: 'og:title', content: newsItem.value?.title },
    { property: 'og:description', content: newsItem.value?.excerpt },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: pageUrl },
    { property: 'og:image', content: newsItem.value?.imageUrl },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: newsItem.value?.title },
    { name: 'twitter:description', content: newsItem.value?.excerpt },
    { name: 'twitter:image', content: newsItem.value?.imageUrl },
  ],
}));
</script>

<style scoped lang="scss">
// Paleta de cores para consistência
:root {
  --primary-color: #1D8A9F;
  --text-dark: #111827;
  --text-light: #4b5563;
  --bg-light: #f9fafb;
  --border-color: #e5e7eb;
}

.article-page {
  background-color: var(--bg-light);
  padding: 2rem 1rem;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.article-header {
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 2rem;
  padding-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.category-tag {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1.2;
}

.article-excerpt {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-top: 1rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-avatar {
  font-size: 2.5rem;
  color: var(--border-color);
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 600;
  color: var(--text-dark);
}

.read-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-image-container {
  margin: 0 0 2rem 0;
  img {
    width: 100%;
    border-radius: 8px;
  }
}

.article-content {
  line-height: 1.7;
  font-size: 1.1rem;
  color: var(--text-dark);

  // Estilização para o conteúdo vindo do v-html
  :deep(p) {
    margin-bottom: 1.5rem;
  }
  :deep(h2) {
    font-size: 1.8rem;
    margin: 2.5rem 0 1rem 0;
    font-weight: 700;
  }
  :deep(blockquote) {
    margin: 2rem 0;
    padding-left: 1.5rem;
    border-left: 4px solid var(--primary-color);
    font-style: italic;
    color: var(--text-light);
  }
}

.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tags-section, .share-section {
  strong {
    margin-right: 1rem;
    font-weight: 600;
  }
}

.tag {
  background-color: var(--bg-light);
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-right: 0.5rem;
  font-size: 0.875rem;
}

.share-links {
  display: inline-flex;
  gap: 1rem;
  a {
    color: var(--text-light);
    font-size: 1.5rem;
    &:hover {
      color: var(--primary-color);
    }
  }
}

.not-found-container, .loading-container {
  text-align: center;
  padding: 4rem 1rem;
}
</style>