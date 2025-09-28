import { query } from '~/server/utils/db'
import type { UserPayload } from '~/server/utils/auth'
import { saveFile, deleteFile } from '~/server/utils/fileStorage' // Supondo que você use um utilitário para upload

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada.' })
  }

  const body = await readMultipartFormData(event)

  // Extrai os campos e o arquivo do corpo
  const fields: Record<string, string> = {}
  let imageFile: Buffer | undefined
  let imageFileName: string | undefined

  for (const part of body || []) {
    if (part.name) {
      if (part.filename) {
        imageFile = part.data
        imageFileName = part.filename
      } else {
        fields[part.name] = part.data.toString('utf-8')
      }
    }
  }

  // Validação básica
  if (!fields.title || fields.title.trim() === '') {
    throw createError({ statusCode: 400, statusMessage: 'O título é obrigatório.' })
  }

  let imageUrl: string | null = null

  // 1. Faz o upload da imagem, se houver
  if (imageFile && imageFileName) {
    try {
      imageUrl = await saveFile(imageFile, imageFileName) // Antes era uploadFile
    } catch (error) {
      console.error('Erro no upload da imagem:', error)
      throw createError({ statusCode: 500, statusMessage: 'Falha ao processar a imagem.' })
    }
  }

  // 2. Prepara os dados para o banco
  const { title, content, status, category, excerpt } = fields
  const tags = fields.tags ? JSON.parse(fields.tags) : [] // Converte a string de tags de volta para array
  const authorId = user.userId
  
  // Define a data de publicação apenas se o status for 'published'
  const publishedAt = status === 'published' ? new Date() : null

  // 3. Insere no banco de dados
  const insertQuery = `
    INSERT INTO news 
      (title, content, status, category, excerpt, tags, image_url, author_id, published_at) 
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
    RETURNING *
  `
  const params = [title, content, status, category, excerpt, tags, imageUrl, authorId, publishedAt]

  try {
    const result = await query(insertQuery, params)
    setResponseStatus(event, 201)
    return result.rows[0]
  } catch (dbError) {
    // Se a inserção no DB falhar, deleta a imagem que já foi enviada
    if (imageUrl) {
      await deleteFile(imageUrl)
    }
    console.error('Erro ao inserir notícia no banco de dados:', dbError)
    throw createError({ statusCode: 500, statusMessage: 'Erro interno ao salvar a notícia.' })
  }
})