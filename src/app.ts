import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import http from "http";
import { initDependencies } from "./config";
import { logger } from "./config/logger";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import { applyMiddleware, applyRoutes } from "./utils";

process.on("uncaughtException", (e) => {
  logger.error({
    extra: e,
    message: `uncaughtException`,
  });
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  logger.error({
    extra: e,
    message: `unhandledRejection`,
  });
  process.exit(1);
});

// initialize configuration
dotenv.config();

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

// port is available to the Node.js runtime
const port = process.env.SERVER_PORT;
const server = http.createServer(router);

async function start() {
  await initDependencies();

  // @ts-ignore
  server.listen(port, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log(`Server is running localhost:${port}...`);
  });
}

start();
