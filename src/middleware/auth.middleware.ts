import { NextFunction, Response } from "express";

import { AuthRequest, HttpStatus } from "../types/index.js";
import { verifyToken } from "../utils/auth.util.js";
import HttpError from "../utils/error.util.js";

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
      HttpStatus.INTERNAL_SERVER_ERROR,
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
