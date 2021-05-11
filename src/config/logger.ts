import dotenv from "dotenv";
import winston from "winston";
import Sentry from "winston-transport-sentry-node";

dotenv.config();

const logger = winston.createLogger({
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
  ),
  level: "debug",
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new Sentry({
      handleExceptions: true,
      sentry: {
        dsn: process.env.SENTRY_DSN,
      },
    }),
  ],
});

export { logger };
