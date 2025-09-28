export interface Publication {
  id: number
  title: string
  authors: string
  abstract?: string
  type: 'article' | 'thesis' | 'dissertation' | 'book' | 'chapter' | 'conference' | 'other'
  year: number
  status: 'published' | 'submitted' | 'in_progress'
  keywords?: string[]
  fileUrl?: string
  doi?: string
  journal?: string
  publisher?: string
  pages?: string
  volume?: string
  issue?: string
  createdAt: string
  updatedAt: string
}

export interface PublicationFilters {
  type?: string
  year?: number
  status?: string
  search?: string
}

export interface PublicationFormData {
  title: string
  authors: string
  abstract?: string
  type: 'article' | 'thesis' | 'dissertation' | 'book' | 'chapter' | 'conference' | 'other'
  year: number
  status: 'published' | 'submitted' | 'in_progress'
  keywords?: string[]
  fileUrl?: string
  doi?: string
  journal?: string
  publisher?: string
  pages?: string
  volume?: string
  issue?: string
}