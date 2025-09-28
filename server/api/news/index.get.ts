import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Pega os parâmetros da URL (ex: /api/news?page=1&limit=10)
  const q = getQuery(event)

  const page = parseInt(q.page as string || '1', 10)
  const limit = parseInt(q.limit as string || '10', 10)
  const offset = (page - 1) * limit

  // Monta a query SQL dinamicamente
  const params: any[] = []
  let whereClauses: string[] = []
  
  // Filtro por notícias em destaque (featured)
  if (q.featured === 'true') {
    whereClauses.push(`featured = true`)
    whereClauses.push(`status = 'published'`) // Destaques devem estar publicados
  }
  
  // Filtro por busca (search)
  if (q.search) {
    params.push(`%${q.search}%`)
    whereClauses.push(`title ILIKE $${params.length}`)
  }
  
  // Filtro por categoria
  if (q.category) {
    params.push(q.category)
    whereClauses.push(`category = $${params.length}`)
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

  // --- Query para contar o total de itens ---
  const countQuery = `SELECT COUNT(*) FROM news ${whereString}`
  const countResult = await query(countQuery, params)
  const total = parseInt(countResult.rows[0].count, 10)

  // --- Query para buscar os dados com paginação e limite ---
  const dataParams = [...params, limit, offset]
  const dataQuery = `
    SELECT * FROM news 
    ${whereString} 
    ORDER BY "published_at" DESC, "created_at" DESC 
    LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
  `
  const dataResult = await query(dataQuery, dataParams)
  
  // Retorna os dados no formato que o frontend espera
  return {
    data: dataResult.rows,
    total,
  }
})