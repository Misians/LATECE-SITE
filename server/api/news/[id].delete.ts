import { query } from '~/server/utils/db'
import type { UserPayload } from '~/server/utils/auth'
import { deleteFile } from '~/server/utils/fileStorage'

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada. Apenas administradores podem deletar.' })
  }
  
  const newsId = parseInt(getRouterParam(event, 'id') as string)
  if (isNaN(newsId)) {
    throw createError({ statusCode: 400, statusMessage: 'ID da notícia inválido.' })
  }

  // 1. Primeiro, busca a notícia no banco para pegar a URL da imagem
  const newsResult = await query('SELECT image_url FROM news WHERE id = $1', [newsId])
  if (newsResult.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Notícia não encontrada para deletar.' })
  }
  const imageUrl = newsResult.rows[0].image_url

  // 2. Deleta a notícia do banco de dados
  await query('DELETE FROM news WHERE id = $1', [newsId])

  // 3. Se havia uma imagem, deleta o arquivo do armazenamento (S3, etc.)
  if (imageUrl) {
    try {
      await deleteFile(imageUrl)
    } catch (error) {
      // Mesmo que a deleção do arquivo falhe, a operação principal (DB) foi um sucesso.
      // Apenas registra o erro no log do servidor.
      console.error(`Falha ao deletar o arquivo de imagem ${imageUrl}:`, error)
    }
  }

  setResponseStatus(event, 204) // No Content
  return
})