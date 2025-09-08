import { Request } from "express";

export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  password: string;
  name?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  resetOtp?: string | null;
  otpExpiry?: Date | null;
  resetSessionToken?: string | null;
  resetSessionExpires?: Date | null;
}

export type UserPublic = Omit<
  User,
  | "resetOtp"
  | "otpExpiry"
  | "resetSessionToken"
  | "resetSessionExpires"
  | "password"
>;

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string | null;
  role?: UserRole;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string | null;
  role?: UserRole;
}

export interface PasswordResetInput {
  resetOtp?: string | null;
  resetSessionToken?: string | null;
}

export type UserListResponse = {
  users: UserPublic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

/**
 * Authentication
 */
export type AuthResponse = {
  user: UserPublic;
  token: string;
  refreshToken?: string;
  expiresIn: number;
};

// Extend Express Request to include user data from JWT
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export type jwtPayload = {
  user: {
    id: number;
    role: string;
  };
};
