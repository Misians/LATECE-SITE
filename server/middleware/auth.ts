// server/middleware/auth.ts
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event).pathname;

  // Protege todas as rotas de API, exceto as de autenticação
  if (url.startsWith('/api/') && !url.startsWith('/api/auth/')) {
    const authHeader = getHeader(event, 'Authorization');
    const token = authHeader?.split(' ')[1];

    if (url.startsWith('/api/news') && event.method === 'GET') {
      return; // Não faz a verificação de token e continua para a rota.
    }

    if (!token) {
      throw createError({ statusCode: 401, statusMessage: 'Token de acesso não fornecido.' });
    }

    const userPayload = verifyToken(token);
    if (!userPayload) {
      throw createError({ statusCode: 401, statusMessage: 'Token inválido ou expirado.' });
    }

    // Anexa os dados do usuário ao contexto do evento para uso posterior
    event.context.user = userPayload;
  }
});