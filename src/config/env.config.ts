const Env = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "*",
  API_VERSION: process.env.API_VERSION ?? ("/api/v1" as string),
  HOST: process.env.HOST ?? "0.0.0.0",
  NODE_PORT: process.env.NODE_PORT ?? "5000",
  SERVER_ENV: process.env.SERVER_ENV ?? "dev",

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE ?? "15m",
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE ?? "7d",
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || "10", 10),
  PEPPER: process.env.PEPPER,
};
console.log("Environment Variables:", Env);
export default Env;
