import { Request, Response } from "express";

import Env from "../config/env.config.js";
import { ErrorResponse } from "../types/index.js";
import { HttpError } from "../utils/error.util.js";

const sendErrorDev = (err: HttpError, res: Response) => {
  const errorResponse: ErrorResponse = {
    error: err,
    message: err.message,
    stack: err.stack,
    status: err.status,
  };

  // Include validation details if they exist
  if (err.validationDetails) {
    errorResponse.validationDetails = err.validationDetails;
  }

  res.status(err.statusCode).json(errorResponse);
};

const sendErrorProd = (err: HttpError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      message: err.message,
      status: err.status,
    };
    if (err.validationDetails) {
      errorResponse.validationDetails = err.validationDetails;
    }

    res.status(err.statusCode).json(errorResponse);

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error("===ERROR", err);

    // 2) Send generic message
    res.status(500).json({
      message: "Something went wrong!",
      status: "error",
    });
  }
};

const globalErrorHandler = (err: HttpError, req: Request, res: Response) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (Env.SERVER_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

export default globalErrorHandler;
