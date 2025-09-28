<template>
  <div class="admin-create-news-page">
    <header class="page-header">
      <!-- ... (seu header aqui) ... -->
    </header>
    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- ... (seu formulário aqui, sem alterações) ... -->
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