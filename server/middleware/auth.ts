// server/middleware/auth.ts
import { verifyToken } from '~/server/utils/auth'; // Supondo que você tenha esta função

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event).pathname;

  // 1. Ignora qualquer rota que não seja da API
  if (!url.startsWith('/api/')) {
    return;
  }

  // 2. Ignora as rotas de autenticação (login, registro, etc.)
  if (url.startsWith('/api/auth/')) {
    return;
  }

  // 3. Define rotas que são públicas apenas para o método GET
  const publicGetRoutes = [
    '/api/news' // Adicione outras rotas aqui, ex: '/api/products'
  ];

  // Verifica se a rota atual é uma das rotas públicas para GET
  const isPublicGetRoute = publicGetRoutes.some(route => url.startsWith(route));

  if (isPublicGetRoute && event.method === 'GET') {
    return; // Permite o acesso público para leitura
  }

  // 4. A partir daqui, todas as outras requisições de API exigem autenticação
  const authHeader = getHeader(event, 'Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Token de acesso não fornecido.' 
    });
  }

  try {
    const userPayload = verifyToken(token);
    if (!userPayload) {
      // Esta verificação pode ser redundante se verifyToken já lança um erro
      throw new Error('Payload do token é inválido');
    }
    // Anexa os dados do usuário ao contexto do evento para uso posterior nas rotas
    event.context.user = userPayload;
  } catch (error) {
    // Captura erros de 'verifyToken' (ex: token expirado, assinatura inválida)
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Token inválido ou expirado.' 
    });
  }
});