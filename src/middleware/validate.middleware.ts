import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { CreateUserSchema } from "../validations/userValidation.js";
import { HttpStatus } from "../types/index.js";

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    CreateUserSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error:
        error instanceof z.ZodError
          ? error.issues.map((e) => e.message).join(", ")
          : "Invalid input",
    });
  }
};
