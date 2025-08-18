import { Request, Response } from "express";

export class HttpError extends Error {
  public status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

export default function errorMiddleware(
  error: Error | HttpError,
  req: Request,
  res: Response
) {
  const status = (error as HttpError).status || 500;
  const message = error.message || "Internal Server Error";
  console.log(error);

  // Log error for debugging
  console.error(
    `[${new Date().toISOString()}] ${status.toString()} ${req.method} ${req.url} - ${message}`
  );

  // Handle specific error types
  if (error.message === "Not allowed by CORS") {
    return res
      .status(403)
      .json({ message: "CORS policy violation", status: 403 });
  }

  if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ message: `Validation error: ${error.message}`, status: 400 });
  }

  if (error.name === "JsonWebTokenError") {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", status: 401 });
  }

  // Hide stack traces in production
  const response =
    process.env.NODE_ENV === "production"
      ? { message, status }
      : { message, stack: error.stack, status };

  res.status(status).json(response);
}
