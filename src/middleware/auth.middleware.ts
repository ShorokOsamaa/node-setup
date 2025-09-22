import { NextFunction, Response } from "express";

import { AuthRequest, HttpStatus } from "../types/index.js";
import { verifyToken } from "../utils/auth.util.js";
import HttpError from "../utils/error.util.js";
import UserData from "../persistance/user.data.js";

// isAuth middleware to verify JWT token
export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "No token provided or invalid format",
        success: false,
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = verifyToken(token);

    const userData = new UserData();
    const user = await userData.findById(decoded.user.id);

    if (user.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );
      if (decoded.iat && decoded.iat < changedTimestamp) {
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          "Password recently changed. Please log in again."
        );
      }
    }

    // Attach user info to request
    req.user = {
      id: decoded.user.id,
      role: decoded.user.role,
    };

    // Proceed to next middleware
    next();
  } catch (error) {
    // Generic error
    throw new HttpError(
      error instanceof HttpError
        ? error.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : "Authentication error"
    );
  }
};

export const hasValidRole =
  (roles: string[]) =>
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role;
      if (!userRole) {
        throw new HttpError(HttpStatus.FORBIDDEN, "Authorization error");
      }
      if (roles.includes(userRole)) {
        next();
      } else {
        throw new HttpError(HttpStatus.FORBIDDEN, "Insufficient permissions");
      }
    } catch {
      throw new HttpError(HttpStatus.FORBIDDEN, "Authorization error");
    }
  };
