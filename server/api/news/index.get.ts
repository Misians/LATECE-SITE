// server/api/news/index.get.ts
import { newsService } from '~/server/services/newsServices'
import type { NewsFilters } from '~/types/news'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // Tratamento dos parâmetros
  const page = parseInt((query.page as string) || '1', 10)
  const limit = parseInt((query.limit as string) || '6', 10)

  const filters: NewsFilters = {
    search: query.search as string,
    featured: query.featured === 'true' ? true : undefined,
    // Não força mais status = 'published' para permitir que
    // você controle isso via dados existentes no banco.
    status: query.status as NewsFilters['status'],
  }

  const result = await newsService.findMany(filters, { page, limit })

  // Normaliza a resposta para o formato esperado pelo frontend:
  // { data: News[], total: number, pagination: { ... } }
  return {
    data: result.news,
    total: result.pagination.total,
    pagination: result.pagination,
  }
})