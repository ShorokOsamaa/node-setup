import cors from "cors";
import express, { Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import Env from "./config/env.config.js";
import indexRouter from "./routes/index.js";
import HttpError from "./utils/error.util.js";

const { ALLOWED_ORIGINS, API_VERSION, HOST, NODE_PORT, SERVER_ENV } = Env;

const app = express();
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    origin: ALLOWED_ORIGINS.split(","),
  })
);

// Logging middleware - "dev" for development logging "combined" for production logging
app.use(morgan(SERVER_ENV === "dev" ? "dev" : "combined"));

// Security middleware
app.use(helmet());
app.use(
  rateLimit({
    handler: () => {
      throw new HttpError(
        429,
        "Too many requests from this IP, please try again after 15 minutes"
      );
    },
    ipv6Subnet: 64,
    legacyHeaders: false,
    limit: 100,
    max: 100,
    standardHeaders: "draft-8",
    windowMs: 15 * 60 * 1000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => res.sendStatus(200));
app.use(API_VERSION, indexRouter);

// Start the Express server
app.listen(NODE_PORT, () => {
  console.log(`The server is running at http://${HOST}:${NODE_PORT}`);
});
