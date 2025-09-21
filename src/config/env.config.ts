const Env = {
  // JWT
  ACCESS_TOKEN_EXPIRE: process.env.ACCESS_TOKEN_EXPIRE ?? "15m",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "*",
  REFRESH_TOKEN_EXPIRE: process.env.REFRESH_TOKEN_EXPIRE ?? "7d",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  // Server
  API_VERSION: process.env.API_VERSION ?? ("/api/v1" as string),
  HOST: process.env.HOST ?? "0.0.0.0",
  NODE_PORT: process.env.NODE_PORT ?? "5000",

  // Hashing
  PEPPER: process.env.PEPPER,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS ?? "10", 10),

  SERVER_ENV: process.env.SERVER_ENV ?? "deployment",

  SENDER_EMAIL: process.env.SENDER_EMAIL,
  SENDER_PASSWORD: process.env.SENDER_PASSWORD,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT ?? "587", 10),
  EMAIL_CC: process.env.EMAIL_CC,
};
console.log("Environment Variables:", Env);
export default Env;
