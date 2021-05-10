import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import http from "http";
import { initDependencies } from "./config";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import routes from "./services";
import { applyMiddleware, applyRoutes } from "./utils";

process.on("uncaughtException", (e) => {
  console.log(e);
  process.exit(1);
});

process.on("unhandledRejection", (e) => {
  console.log(e);
  process.exit(1);
});

// initialize configuration
dotenv.config();

const router = express();
applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);

// port is now available to the Node.js runtime
// as if it were an environment variable
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
