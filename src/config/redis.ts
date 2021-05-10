import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "127.0.0.1",
});

const init = async () => {
  return new Promise((resolve, reject) => {
    redisClient.on("connect", () => {
      console.log("Redis client connected");
      resolve(redisClient);
    });

    redisClient.on("error", (error) => {
      reject(error);
    });
  });
};

export { init, redisClient };
