import { query } from '~/server/utils/db'
import type { Equipment } from '~/types/equipment'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  const filters = {
    search: (q.search as string) || '',
    category: (q.category as string) || '',
    status: (q.status as string) || '',
  }

  const params: any[] = []
  const whereClauses: string[] = []

  if (filters.search) {
    params.push(`%${filters.search}%`)
    whereClauses.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`)
  }

  if (filters.category) {
    params.push(filters.category)
    whereClauses.push(`category = $${params.length}`)
  }

  if (filters.status) {
    params.push(filters.status)
    whereClauses.push(`status = $${params.length}`)
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const sql = `
    SELECT
      id,
      name,
      description,
      category,
      image_url AS "imageUrl",
      location,
      status,
      specifications,
      notes,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM equipment
    ${whereString}
    ORDER BY name ASC
  `

  const result = await query(sql, params)

  return result.rows as Equipment[]
})

