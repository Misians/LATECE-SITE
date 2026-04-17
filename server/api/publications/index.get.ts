import { query } from '~/server/utils/db'
import type { Publication } from '~/types/publication'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  const filters = {
    search: (q.search as string) || '',
    type: (q.type as string) || '',
    year: q.year ? Number(q.year) : undefined,
    status: (q.status as string) || '',
  }

  const params: any[] = []
  const whereClauses: string[] = []

  if (filters.search) {
    params.push(`%${filters.search}%`)
    whereClauses.push(`(
      title ILIKE $${params.length}
      OR authors ILIKE $${params.length}
      OR abstract ILIKE $${params.length}
    )`)
  }

  if (filters.type) {
    params.push(filters.type)
    whereClauses.push(`type = $${params.length}`)
  }

  if (filters.year) {
    params.push(filters.year)
    whereClauses.push(`year = $${params.length}`)
  }

  if (filters.status) {
    params.push(filters.status)
    whereClauses.push(`status = $${params.length}`)
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const sql = `
    SELECT
      id,
      title,
      authors,
      abstract,
      type,
      year,
      status,
      keywords,
      file_url AS "fileUrl",
      doi,
      journal,
      publisher,
      pages,
      volume,
      issue,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM publications
    ${whereString}
    ORDER BY year DESC, title ASC
  `

  const result = await query(sql, params)

  return result.rows as Publication[]
})

