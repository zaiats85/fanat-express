import { init as initRedis } from "./cache";
import { init as initPostgres } from "./db";
import { init as initRabbitMQ } from "./messenger";

const initDependencies = async () => {
  await Promise.all([
        initRedis(),
        initPostgres(),
        // initRabbitMQ(),
      ],
  );
};

export { initDependencies };
