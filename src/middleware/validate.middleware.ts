import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "../validations/userValidation.js";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    CreateUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        details: errorDetails,
      });
    }
    res.status(500).json({ message: "Internal server error", details: [] });
  }
};

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    UpdateUserSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const errorDetails = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({
        message: "Validation failed",
        details: errorDetails,
      });
    }
    res.status(500).json({ message: "Internal server error", details: [] });
  }
};
