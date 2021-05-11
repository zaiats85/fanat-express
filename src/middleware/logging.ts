import dotenv from "dotenv";
import { Router } from "express";
import expressWinston from "express-winston";
import winston from "winston";
import Sentry from "winston-transport-sentry-node";

dotenv.config();

const handleLogging = (router: Router) =>
    router.use(
        expressWinston.logger({
          format: winston.format.combine(
              winston.format.colorize(),
              winston.format.json(),
          ),
          msg: "HTTP {{req.method}} {{req.url}}",
          transports: [
            new Sentry({
              handleExceptions: true,
              sentry: {
                dsn: process.env.SENTRY_DSN,
              },
            }),
            new winston.transports.Console({ handleExceptions: true }),

          ],
        }),
    );

export { handleLogging };
