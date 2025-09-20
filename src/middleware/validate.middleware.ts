import { NextFunction, Request, Response } from "express";
import { ZodError, ZodIssue, ZodType } from "zod";

import HttpError from "../utils/error.util.js";
import { ValidationDetail } from "../types/index.js";
import { ZodInvalidTypeIssue } from "zod/v3";

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedParams?: unknown;
      validatedQuery?: unknown;
    }
  }
}

export const validate = <T extends ZodType>(
  schema: T,
  source: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req[source]);
      console.log("Validated Data:", validatedData);

      // Store validated data in a new property
      if (source === "body") {
        req.validatedBody = validatedData;
        req.body = validatedData; // Body can be overwritten
      } else if (source === "query") {
        req.validatedQuery = validatedData;
      } else if (source === "params") {
        req.validatedParams = validatedData;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails: ValidationDetail[] = error.issues.map(
          (err: ZodIssue) => ({
            code: err.code,
            field: err.path.join("."),
            message: err.message,
            received:
              err.code === "invalid_type"
                ? (err as ZodInvalidTypeIssue).received
                : undefined,
          })
        );
        throw new HttpError(400, "Validation failed", errorDetails);
      }
      console.log("Validation Error:", error);
      throw new HttpError(500, "Internal server error");
    }
  };
};
