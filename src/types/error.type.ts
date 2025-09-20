import HttpError from "../utils/error.util.js";

export enum HttpStatus {
  OK = 200,
  CREATED = 201,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  GONE = 410,

  INTERNAL_SERVER_ERROR = 500,
}

export interface ValidationDetail {
  field: string;
  message: string;
  code: string;
  received?: string | undefined;
}

export interface ErrorResponse {
  status: string;
  message: string;
  stack?: string | undefined;
  error?: HttpError;
  validationDetails?: ValidationDetail[];
}
