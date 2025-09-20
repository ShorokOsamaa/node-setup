import { ValidationDetail } from "../types/index.js";

export class HttpError extends Error {
  public isOperational: boolean;
  public status: string;
  public statusCode: number;
  public validationDetails?: ValidationDetail[];

  constructor(
    statusCode: number,
    message: string,
    validationDetails?: ValidationDetail[]
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.validationDetails = validationDetails;

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    Error.captureStackTrace(this, this.constructor);
  }
}

export default HttpError;
