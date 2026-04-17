// server/utils/auth.ts
import jwt from 'jsonwebtoken';
import type { User } from '~/types'; // Certifique-se que esse tipo existe

export interface UserPayload {
  userId: number;
  role: string;
}

// Em Nuxt 3, o ideal é usar useRuntimeConfig(), mas process.env funciona se carregado corretamente
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET não está configurada. ' +
    'Defina JWT_SECRET no arquivo .env para que o login funcione corretamente.'
  );
}

export function signToken(user: User) {
  // O erro estava aqui: faltava fechar essa função antes de começar a próxima
  return jwt.sign(
    { userId: user.id, role: user.role } as UserPayload,
    JWT_SECRET as string,
    { expiresIn: '24h' }
  );
} // <--- ADICIONEI ESTA CHAVE QUE FALTAVA

export function verifyToken(token: string): UserPayload | null {
  if (!JWT_SECRET) {
    return null;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET as string);
    
    // Verificação de segurança
    if (
      typeof payload === 'object' &&
      payload !== null &&
      'userId' in payload &&
      'role' in payload
    ) {
      return {
        userId: (payload as any).userId,
        role: (payload as any).role,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}