import bcrypt from 'bcryptjs';
import { query } from '~/server/utils/db';
import { signToken } from '~/server/utils/auth';
import type { User } from '~/types';
import { z } from 'zod';

// Esquema de validação para login
const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Informe o usuário ou e-mail.'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export default defineEventHandler(async (event) => {
  // Valida o corpo da requisição com Zod
  const body = await readValidatedBody(event, (data) => loginSchema.safeParse(data));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados de login inválidos.',
      data: body.error.issues,
    });
  }

  const { username, password } = body.data;

  const result = await query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [username]
  );

  // Mantém a mensagem genérica para não revelar se o usuário existe ou não
  if (result.rows.length === 0) {
    throw createError({
      statusCode: 401,
      message: 'Usuário ou senha inválidos.',
    });
  }

  // A resposta do DB vem como snake_case, o tipo User espera camelCase
  const userFromDb = result.rows[0];
  const user: User = {
    id: userFromDb.id,
    username: userFromDb.username,
    email: userFromDb.email,
    passwordHash: userFromDb.password_hash,
    fullName: userFromDb.full_name,
    role: userFromDb.role,
    createdAt: userFromDb.created_at
  };

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Usuário ou senha inválidos.',
    });
  }

  const token = signToken(user);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
});
