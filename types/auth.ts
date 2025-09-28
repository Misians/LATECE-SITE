export interface User {
  id: number
  username: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  fullName: string
}

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
