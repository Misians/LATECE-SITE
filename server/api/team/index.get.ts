import { query } from '~/server/utils/db'
import type { TeamMember } from '~/types/team'

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  const role = (q.role as string) || ''
  const search = (q.search as string) || ''

  const params: any[] = []
  const whereClauses: string[] = []

  if (role) {
    params.push(role)
    whereClauses.push(`role = $${params.length}`)
  }

  if (search) {
    params.push(`%${search}%`)
    whereClauses.push(`(name ILIKE $${params.length} OR bio ILIKE $${params.length})`)
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

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
    ${whereString}
    ORDER BY role ASC, name ASC
  `

  const result = await query(sql, params)

  return result.rows as TeamMember[]
})

