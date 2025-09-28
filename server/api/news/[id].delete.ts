import { query } from '~/server/utils/db';
import type { UserPayload } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload;
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada. Apenas administradores podem deletar.' });
  }
  
  const newsId = getRouterParam(event, 'id');
  await query('DELETE FROM news WHERE id = $1', [newsId]);

  setResponseStatus(event, 204); // No Content
  return;
});