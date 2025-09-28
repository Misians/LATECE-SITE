// types/news.ts

// Tipo específico para o status, para evitar erros de digitação
export type NewsStatus = 'published' | 'draft'

// Interface completa que inclui TODAS as propriedades usadas no projeto
export interface News {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  status: NewsStatus;
  category: string;      // <-- ADICIONADO
  featured: boolean;
  tags: string[];        // <-- ADICIONADO
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  authorId?: number;
  authorName?: string;
  views?: number;
}

export interface NewsFilters {
  status?: 'draft' | 'published'
  featured?: boolean
  search?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface NewsResponse {
  success: boolean
  data: {
    news: News[]
    pagination: Pagination
  }
}

export interface NewsItemResponse {
  success: boolean
  data: News
}
