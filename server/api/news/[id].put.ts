import { query } from '~/server/utils/db';
import type { UserPayload } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload;
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada.' });
  }
  
  const newsId = getRouterParam(event, 'id');
  const { title, content, status } = await readBody(event);

  const result = await query(
    'UPDATE news SET title = $1, content = $2, status = $3 WHERE id = $4 RETURNING *',
    [title, content, status, newsId]
  );
  
  return result.rows[0];
});