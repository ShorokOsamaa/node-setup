import { Request } from "express";

import { UserRoleType } from "../validations/userValidation.js";

// export type UserRole = "USER" | "ADMIN";

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Extend Express Request to include user data from JWT
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

/**
 * Authentication
 */
export interface AuthResponse {
  expiresIn: number;
  refreshToken?: string;
  token: string;
  user: UserPublic;
}

export interface CreateUserInput {
  email: string;
  firstName: null | string;
  lastName: null | string;
  password: string;
  role: UserRoleType;
  username: string;
}

export interface jwtPayload {
  user: {
    id: number;
    role: string;
  };
}

export interface PasswordResetInput {
  resetOtp?: null | string;
  resetSessionToken?: null | string;
}

export interface UpdateUserInput {
  email?: string;
  firstName?: null | string;
  lastName?: null | string;
  password?: string;
  role?: UserRoleType;
  username?: null | string;
}

export interface User {
  createdAt: Date;
  email: string;
  firstName?: null | string;
  id: number;
  lastName?: null | string;
  otpExpiry?: Date | null;
  password: string;
  resetOtp?: null | string;
  resetSessionExpiry?: Date | null;
  resetSessionToken?: null | string;
  role: string;
  updatedAt: Date;
  username: string;
}

export interface UserListResponse {
  pagination: {
    limit: number;
    page: number;
    pages: number;
    total: number;
  };
  users: UserPublic[];
}

export type UserPublic = Omit<
  User,
  | "otpExpiry"
  | "password"
  | "resetOtp"
  | "resetSessionExpiry"
  | "resetSessionToken"
>;

export interface UserQueryParams {
  limit: number;
  page: number;
  search?: string;
}
