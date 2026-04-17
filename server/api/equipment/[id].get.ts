import { query } from '~/server/utils/db'
import type { Equipment } from '~/types/equipment'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id') as string | undefined
  const equipmentId = rawId ? parseInt(rawId, 10) : NaN

  if (Number.isNaN(equipmentId)) {
    throw createError({
      statusCode: 400,
      message: 'O ID do equipamento deve ser um número.',
    })
  }

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
    WHERE id = $1
  `

  const result = await query(sql, [equipmentId])

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Equipamento não encontrado.',
    })
  }

  return result.rows[0] as Equipment
})

