<template>
  <div class="admin-create-news-page">
    <!-- Header da Página -->
    <header class="page-header">
      <div class="page-header-content">
        <div class="page-title">
          <h1>Criar Nova Notícia</h1>
          <p>Preencha os campos abaixo para adicionar uma notícia ao portal.</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-secondary" @click="saveDraft">Salvar Rascunho</button>
          <button class="btn btn-primary" @click="handleSubmit" :disabled="isSubmitting">
            <span v-if="isSubmitting">Publicando...</span>
            <span v-else>Publicar Notícia</span>
          </button>
        </div>
      </div>
    </header>
    
    <!-- Formulário Principal -->
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="form-main">
        <!-- Campos de Texto -->
        <div class="form-group">
          <label for="title" class="form-label">Título</label>
          <input id="title" v-model="form.title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }" placeholder="Título da notícia" />
          <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
        </div>
        <div class="form-group">
          <label for="content" class="form-label">Conteúdo Principal</label>
          <!-- Aqui você pode substituir por um editor de texto rico (WYSIWYG) no futuro -->
          <textarea id="content" v-model="form.content" class="form-control" :class="{ 'is-invalid': errors.content }" rows="10" placeholder="Escreva o conteúdo da notícia aqui..."></textarea>
          <div v-if="errors.content" class="error-message">{{ errors.content }}</div>
        </div>
        <div class="form-group">
          <label for="excerpt" class="form-label">Resumo (Opcional)</label>
          <textarea id="excerpt" v-model="form.excerpt" class="form-control" rows="3" placeholder="Um resumo curto que aparecerá na listagem de notícias."></textarea>
        </div>
      </div>
      
      <aside class="form-sidebar">
        <!-- Card de Status e Visibilidade -->
        <div class="sidebar-card">
          <h3 class="card-title">Publicação</h3>
          <div class="form-group">
            <label for="status" class="form-label">Status</label>
            <select id="status" v-model="form.status" class="form-control">
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="category" class="form-label">Categoria</label>
            <select id="category" v-model="form.category" class="form-control">
              <option value="">Selecione...</option>
              <option value="Evento">Evento</option>
              <option value="Notícia">Notícia</option>
              <option value="Aviso">Aviso</option>
            </select>
          </div>
        </div>
        
        <!-- Card de Imagem -->
        <div class="sidebar-card">
          <h3 class="card-title">Imagem de Destaque</h3>
          <div class="image-upload-area" 
               @click="triggerFileUpload" 
               @dragover.prevent="isDragOver = true" 
               @dragleave.prevent="isDragOver = false" 
               @drop.prevent="handleFileDrop"
               :class="{ 'drag-over': isDragOver }">
            <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="file-input" />
            <div v-if="!imagePreview" class="upload-prompt">
              <Icon name="mdi:image-plus" class="upload-icon" />
              <p>Arraste uma imagem ou clique para selecionar</p>
            </div>
            <div v-else class="image-preview-wrapper">
              <img :src="imagePreview" alt="Pré-visualização da imagem" class="image-preview" />
              <button @click.stop="removeImage" class="remove-image-btn" type="button">Remover</button>
            </div>
          </div>
        </div>
        
        <!-- Card de Tags -->
        <div class="sidebar-card">
          <h3 class="card-title">Tags</h3>
          <div class="tags-input-wrapper">
            <input v-model="tagsInput" @keydown.enter.prevent="addTags" type="text" class="form-control" placeholder="Adicione tags (separadas por vírgula)" />
            <button @click="addTags" type="button" class="btn btn-secondary">Add</button>
          </div>
          <div class="tags-list" v-if="form.tags && form.tags.length > 0">
            <span v-for="tag in form.tags" :key="tag" class="tag-item">
              {{ tag }}
              <button @click="removeTag(tag)" class="remove-tag-btn" type="button">&times;</button>
            </span>
          </div>
        </div>
      </aside>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useNewsStore } from '@/stores/news'
import type { NewsFormData } from '@/types'

// Meta tags e Middleware
useHead({
  title: 'Nova Notícia - Admin LATECE',
  meta: [{ name: 'description', content: 'Criar nova notícia no Portal LATECE' }]
})
definePageMeta({
  middleware: 'auth'
})

// Stores e Router
const newsStore = useNewsStore()
const router = useRouter()

// Reactive data - Conforme a interface NewsFormData
const form = ref<NewsFormData>({
  title: '',
  content: '',
  excerpt: '',
  category: '',
  status: 'draft',
  image: null,
  tags: [],
})

// Variáveis de estado da UI
const imagePreview = ref<string | null>(null)
const isSubmitting = ref(false)
const errors = ref({ title: '', content: '' })
const fileInput = ref<HTMLInputElement | null>(null)
const isDragOver = ref(false)
const tagsInput = ref('')

// --- VALIDAÇÃO E SUBMISSÃO ---
const validateForm = () => {
  errors.value = { title: '', content: '' }
  let isValid = true
  if (!form.value.title.trim()) {
    errors.value.title = 'Título é obrigatório'
    isValid = false
  }
  if (!form.value.content.trim()) {
    errors.value.content = 'Conteúdo é obrigatório'
    isValid = false
  }
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('content', form.value.content)
  formData.append('status', form.value.status)
  formData.append('category', form.value.category)
  if (form.value.excerpt) formData.append('excerpt', form.value.excerpt)
  if (form.value.tags) formData.append('tags', JSON.stringify(form.value.tags))
  if (form.value.image) formData.append('image', form.value.image)

  try {
    const result = await newsStore.createNews(formData)
    if (result && result.success) {
      await router.push('/admin/news')
    } else {
      console.error('Error creating news:', result?.error || 'Unknown error')
    }
  } catch (error) {
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = async () => {
  form.value.status = 'draft'
  await handleSubmit()
}

// --- MANIPULAÇÃO DE ARQUIVOS ---
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione apenas arquivos de imagem.')
    return
  }
  form.value.image = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) processFile(file)
}

const handleFileDrop = (event: DragEvent) => {
  isDragOver.value = false
  const file = event.dataTransfer?.files[0]
  if (file) processFile(file)
}

const removeImage = () => {
  imagePreview.value = null
  form.value.image = null
  if (fileInput.value) fileInput.value.value = ''
}

// --- MANIPULAÇÃO DE TAGS ---
const addTags = () => {
  if (tagsInput.value.trim() === '') return
  const newTags = tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
  
  if (!form.value.tags) {
    form.value.tags = []
  }
  form.value.tags = [...new Set([...form.value.tags, ...newTags])]
  tagsInput.value = ''
}

const removeTag = (tagToRemove: string) => {
  if (form.value.tags) {
    form.value.tags = form.value.tags.filter(tag => tag !== tagToRemove)
  }
}
</script>