import bcrypt from 'bcryptjs';
import { query } from '~/server/utils/db';
import { signToken } from '~/server/utils/auth';
import type { User } from '~/types';

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Usuário e senha são obrigatórios.' });
  }

  const result = await query(
    'SELECT * FROM users WHERE username = $1 OR email = $1',
    [username]
  );

  if (result.rows.length === 0) {
    throw createError({ statusCode: 401, statusMessage: 'Credenciais inválidas.' });
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
    throw createError({ statusCode: 401, statusMessage: 'Credenciais inválidas.' });
  }

  const token = signToken(user);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
});
