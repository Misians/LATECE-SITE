// server/middleware/auth.ts
import { verifyToken } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event).pathname;

  // 1. Ignora qualquer rota que não seja da API (arquivos estáticos, páginas html, etc)
  if (!url.startsWith('/api/')) {
    return;
  }

  // 2. LISTA DE EXCEÇÕES (Rotas que NÃO precisam de Token JWT)
  // Adicionei '/api/admin/create-user' aqui
  const publicRoutes = [
    '/api/auth/',            // Login e Refresh Token
    '/api/admin/create-user' // <--- AQUI: Sua rota de criação secreta
  ];

  if (publicRoutes.some(route => url.startsWith(route))) {
    return; // Passa direto sem pedir token
  }

  // 3. Define rotas que são públicas APENAS para o método GET
  const publicGetRoutes = [
    '/api/news',
    '/api/equipment',
    '/api/publications',
    '/api/team',
  ];

  const isPublicGetRoute = publicGetRoutes.some(route => url.startsWith(route));

  // Se for uma rota pública E o método for GET, libera o acesso
  if (isPublicGetRoute && event.method === 'GET') {
    return;
  }

  // 4. A partir daqui, verifica o Token JWT
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
      throw createError({ statusCode: 401, statusMessage: 'Token inválido.' });
    }
    
    // Anexa os dados do usuário ao contexto (para saber quem é o usuario nas próximas rotas)
    event.context.user = userPayload;

  } catch (error) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Token inválido ou expirado.' 
    });
  }
});