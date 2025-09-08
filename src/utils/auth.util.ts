import jwt, { Secret, SignOptions } from "jsonwebtoken";
import Env from "../config/env.config.js";
import HttpError from "./error.util.js";
import { HttpStatus, jwtPayload, UserPublic } from "../types/index.js";

const { ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRE } = Env;

const signUser = (user: UserPublic) => {
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  if (!ACCESS_TOKEN_EXPIRE) {
    throw new Error("ACCESS_TOKEN_EXPIRE is not defined");
  }

  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: ACCESS_TOKEN_EXPIRE as jwt.SignOptions["expiresIn"],
  };

  const token = jwt.sign({ user }, ACCESS_TOKEN_SECRET as Secret, options);
  return token;
};

const verifyToken = (authToken: string): jwtPayload => {
  try {
    const decoded = jwt.verify(
      authToken,
      ACCESS_TOKEN_SECRET as Secret
    ) as jwtPayload;
    return decoded;
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Invalid token");
    }
    // Generic error
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Authentication error"
    );
  }
};

export { signUser, verifyToken };
