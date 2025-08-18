const Env = {
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ?? "*",
  API_VERSION: process.env.API_VERSION ?? ("/api/v1" as string),
  HOST: process.env.HOST ?? "0.0.0.0",
  NODE_PORT: process.env.NODE_PORT ?? "5000",
  SERVER_ENV: process.env.SERVER_ENV ?? "dev",
};

export default Env;
