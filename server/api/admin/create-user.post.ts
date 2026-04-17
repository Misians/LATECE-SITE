import bcrypt from 'bcryptjs'
import { query } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  // 1. SEGURANÇA: Verifica a Senha Mestra
  if (body.adminKey !== config.adminRegistrationKey) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Senha de administrador incorreta. Acesso negado.'
    })
  }

  // Validação básica
  if (!body.username || !body.password || !body.email) {
    throw createError({ statusCode: 400, statusMessage: 'Dados incompletos' })
  }

  // 2. HASH: Criptografar a senha do novo usuário
  // O número 10 é o "salt rounds" (custo de processamento), 10 é um bom padrão
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  try {
    // 3. BANCO: Inserir usuário com a senha já criptografada
    // Ajuste os nomes das colunas conforme sua tabela real
    const sql = `
      INSERT INTO users (username, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, username, email, role
    `
    
    const values = [
      body.username,
      body.email,
      passwordHash,      // <-- Salvamos o hash, NUNCA a senha pura
      body.role || 'user' // Default para user se não for informado
    ]

    const result = await query(sql, values)

    return {
      success: true,
      user: result.rows[0]
    }

  } catch (error: any) {
    // Tratamento de erro para duplicidade (ex: email já existe)
    if (error.code === '23505') { // Código comum de Unique Violation no Postgres
      throw createError({ statusCode: 409, statusMessage: 'Usuário ou Email já cadastrados' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Erro ao criar usuário' })
  }
})