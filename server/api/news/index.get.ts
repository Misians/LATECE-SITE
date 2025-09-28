// server/api/news/index.get.ts
import { query } from '~/server/utils/db'
import type { News } from '~/types'

export default defineEventHandler(async (event) => {
  // Pega os parâmetros da URL
  const queryParams = getQuery(event)
  
  const page = parseInt(queryParams.page as string || '1')
  const limit = parseInt(queryParams.limit as string || '9')
  const search = queryParams.search as string || ''
  const category = queryParams.category as string || ''
  
  const offset = (page - 1) * limit

  // Constrói a consulta SQL dinamicamente
  let baseQuery = 'FROM news WHERE status = \'published\''
  const params = []
  let paramIndex = 1

  if (search) {
    baseQuery += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`
    params.push(`%${search}%`)
    paramIndex++
  }

  if (category) {
    baseQuery += ` AND category = $${paramIndex}`
    params.push(category)
    paramIndex++
  }

  // Consulta para obter o número total de itens (para paginação)
  const countResult = await query(`SELECT COUNT(*) ${baseQuery}`, params)
  const total = parseInt(countResult.rows[0].count)

  // Consulta para obter os itens da página atual
  const dataResult = await query(
    `SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
    [...params, limit, offset]
  )

  return {
    data: dataResult.rows as News[],
    total,
  }
})