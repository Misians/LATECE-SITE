import { verifyToken } from '~/server/utils/auth'
import { query } from '~/server/utils/db'
import type { User } from '~/types'

type PublicUser = Omit<User, 'passwordHash'>

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token de acesso não fornecido.'
    })
  }

  const payload = verifyToken(token)

  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Token inválido ou expirado.'
    })
  }

  // Garante que o usuário ainda existe e mantém os dados atualizados
  const result = await query(
    'SELECT id, username, email, full_name, role, created_at FROM users WHERE id = $1',
    [payload.userId]
  )

  if (result.rows.length === 0) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Usuário não encontrado.'
    })
  }

  const row = result.rows[0]

  const user: PublicUser = {
    id: row.id,
    username: row.username,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at
  }

  return {
    user
  }
})

