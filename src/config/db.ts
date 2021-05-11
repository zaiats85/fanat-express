import dotenv from "dotenv";
import { Client } from "pg";
import { logger } from "./logger";

dotenv.config();

const { DATABASE_URL } = process.env;

const dbClient = new Client({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

dbClient.on("error", (err: Error) => {
  logger.info({
    extra: err,
    message: `Postgres client: Unexpected error on idle client`,
  });

  process.exit(1);
});

const init = async () => {
  await dbClient.connect();
  logger.info({
    message: `Postgres client connected`,
  });
};

export { init, dbClient };
