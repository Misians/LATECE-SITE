import { query } from '~/server/utils/db';
import type { UserPayload } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const user = event.context.user as UserPayload;
  if (user.role !== 'admin' && user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Permissão negada.' });
  }
  
  const newsId = getRouterParam(event, 'id');
  const body = await readBody(event);

  // Lógica para atualização parcial (patch)
  const fields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Adiciona apenas os campos que vieram no corpo da requisição
  for (const [key, value] of Object.entries(body)) {
    if (['title', 'content', 'status', 'category', 'excerpt', 'image_url'].includes(key)) {
      fields.push(`${key} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
  }

  if (fields.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Nenhum campo para atualizar fornecido.' });
  }

  values.push(newsId); // Adiciona o ID da notícia como último parâmetro

  const updateQuery = `UPDATE news SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  
  const result = await query(updateQuery, values);

  if (result.rows.length === 0) {
    throw createError({ statusCode: 404, statusMessage: 'Notícia não encontrada.' });
  }
  
  return result.rows[0];
});