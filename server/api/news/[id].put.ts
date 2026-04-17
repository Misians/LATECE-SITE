import { query } from '~/server/utils/db'
import type { UserPayload } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada.' })
  }
  
  const newsId = parseInt(getRouterParam(event, 'id') as string)
  if (isNaN(newsId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID da notícia inválido.' })
  }

  const body = await readBody(event)

  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // Pega o status atual da notícia para a lógica de 'published_at'
  const currentNewsResult = await query('SELECT status FROM news WHERE id = $1', [newsId])
  if (currentNewsResult.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Notícia não encontrada.' })
  }
  const currentStatus = currentNewsResult.rows[0].status

  // Adiciona apenas os campos que vieram no corpo da requisição
  for (const [key, value] of Object.entries(body)) {
    if (['title', 'content', 'status', 'category', 'excerpt', 'image_url', 'tags'].includes(key)) {
      fields.push(`${key} = $${paramIndex}`)
      // Se for 'tags', ele já deve vir como array do frontend
      values.push(value)
      paramIndex++
    }
  }

  // Lógica inteligente para a data de publicação
  // Só define `published_at` se o status ESTIVER MUDANDO para 'published'
  if (body.status === 'published' && currentStatus !== 'published') {
    fields.push(`published_at = $${paramIndex}`)
    values.push(new Date())
    paramIndex++
  }

  if (fields.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhum campo para atualizar fornecido.' })
  }

  values.push(newsId)

  const updateQuery = `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`
  
  const result = await query(updateQuery, values)
  
  return result.rows[0]
})