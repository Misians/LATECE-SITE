import type { User as BaseUser } from './index'

// Reutiliza o tipo de usuário global, mas sem o hash da senha,
// que nunca deve ser exposto para o frontend.
export type User = Omit<BaseUser, 'passwordHash'>

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    token: string
    user: User
  }
}

export interface AuthError {
  success: false
  error: {
    message: string
  }
}
