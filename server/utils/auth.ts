// server/utils/auth.ts
import jwt from 'jsonwebtoken';
import type { User } from '~/types';

export interface UserPayload {
  userId: number;
  role: string;
}

export function signToken(user: User) {
  return jwt.sign(
    { userId: user.id, role: user.role } as UserPayload,
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;
  } catch (error) {
    return null;
  }
}