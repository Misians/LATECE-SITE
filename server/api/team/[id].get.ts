import { query } from '~/server/utils/db'
import type { TeamMember } from '~/types/team'

export default defineEventHandler(async (event) => {
  const rawId = getRouterParam(event, 'id') as string | undefined
  const memberId = rawId ? parseInt(rawId, 10) : NaN

  if (Number.isNaN(memberId)) {
    throw createError({
      statusCode: 400,
      message: 'O ID do membro deve ser um número.',
    })
  }

  const sql = `
    SELECT
      id,
      name,
      role,
      bio,
      photo_url AS "photoUrl",
      email,
      lattes_url AS "lattesUrl",
      orcid,
      research_areas AS "researchAreas",
      education,
      experience,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM team
    WHERE id = $1
  `

  const result = await query(sql, [memberId])

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Membro da equipe não encontrado.',
    })
  }

  return result.rows[0] as TeamMember
})

