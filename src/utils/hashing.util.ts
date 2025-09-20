import bcrypt from "bcrypt";

import Env from "../config/env.config.js";

const { PEPPER, SALT_ROUNDS } = Env;

if (!PEPPER) {
  throw new Error("Missing PEPPER in environment variables");
}

if (!SALT_ROUNDS) {
  throw new Error("Missing SALT_ROUNDS in environment variables");
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password + PEPPER, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password + PEPPER, SALT_ROUNDS);
}
