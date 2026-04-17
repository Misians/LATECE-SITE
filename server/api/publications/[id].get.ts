import { query } from '~/server/utils/db'
import type { Publication } from '~/types/publication'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id') as string | undefined
  const publicationId = rawId ? parseInt(rawId, 10) : NaN

  if (Number.isNaN(publicationId)) {
    throw createError({
      statusCode: 400,
      message: 'O ID da publicação deve ser um número.',
    })
  }

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
    WHERE id = $1
  `

  const result = await query(sql, [publicationId])

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Publicação não encontrada.',
    })
  }

  return result.rows[0] as Publication
})

