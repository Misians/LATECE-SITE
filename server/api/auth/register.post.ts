// server/api/auth/register.post.ts
import bcrypt from 'bcryptjs';
import { query } from '~/server/utils/db';
import { z } from 'zod';

// Usando Zod para validação
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => registerSchema.safeParse(body));

  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Dados de registro inválidos.', data: body.error.issues });
  }

  const { username, email, password, fullName } = body.data;

  const existingUser = await query('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
  if (existingUser.rows.length > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Usuário ou e-mail já existe.' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query(
    'INSERT INTO users (username, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, full_name, role',
    [username, email, passwordHash, fullName, 'user'] // Novos usuários são 'user' por padrão
  );

  setResponseStatus(event, 201);
  return { user: result.rows[0] };
});