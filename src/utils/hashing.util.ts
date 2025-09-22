import bcrypt from "bcrypt";
import Env from "../config/env.config.js";
import HttpError from "./error.util.js";
import { HttpStatus } from "../types/error.type.js";

const { PEPPER, SALT_ROUNDS } = Env;

if (!PEPPER) {
  throw new HttpError(
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Missing PEPPER in environment variables"
  );
}

if (!SALT_ROUNDS) {
  throw new HttpError(
    HttpStatus.INTERNAL_SERVER_ERROR,
    "Missing SALT_ROUNDS in environment variables"
  );
}

const pepper = PEPPER;
const saltRounds = Number(SALT_ROUNDS);

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password + pepper, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password + pepper, saltRounds);
}
