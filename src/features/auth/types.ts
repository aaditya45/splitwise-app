export interface AuthUser {
  userId: number;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
  type: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}