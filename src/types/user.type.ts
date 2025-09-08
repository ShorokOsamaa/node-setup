import { Request } from "express";
import { UserRoleType } from "../validations/userValidation.js";

// export type UserRole = "USER" | "ADMIN";

export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  resetOtp?: string | null;
  otpExpiry?: Date | null;
  resetSessionToken?: string | null;
  resetSessionExpires?: Date | null;
}

export interface CreateUserInput {
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  password: string;
  role: UserRoleType;
}

export interface UpdateUserInput {
  email?: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  password?: string;
  role?: UserRoleType;
}

export interface PasswordResetInput {
  resetOtp?: string | null;
  resetSessionToken?: string | null;
}

export type UserPublic = Omit<
  User,
  | "resetOtp"
  | "otpExpiry"
  | "resetSessionToken"
  | "resetSessionExpires"
  | "password"
>;

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
 * Standard API response wrapper
 */
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
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
