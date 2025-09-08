import bcrypt from "bcrypt";
import Env from "../config/env.config.js";

const { PEPPER, SALT_ROUNDS } = Env;

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password + PEPPER, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password + PEPPER, hash);
}
