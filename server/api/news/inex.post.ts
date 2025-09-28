import { query } from '~/server/utils/db';
import type { UserPayload } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // O middleware de autenticação já protegeu esta rota e adicionou o usuário ao contexto
  const user = event.context.user as UserPayload;
  
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada.' });
  }

  const { title, content, status } = await readBody(event);
  
  const result = await query(
    'INSERT INTO news (title, content, status, author_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [title, content, status, user.userId]
  );
  
  setResponseStatus(event, 201);
  return result.rows[0];
});