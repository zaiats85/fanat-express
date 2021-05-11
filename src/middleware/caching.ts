import { NextFunction, Response } from "express";
import { promisify } from "util";
import { redisClient } from "../config/cache";

const getAsync = promisify(redisClient.get).bind(redisClient);

const getFromCache = async (key: string, res: Response, next: NextFunction) => {
  const data = await getAsync(key);

  if (data) {
    res.status(200).send(data);
  } else {
    next();
  }
};

export { getFromCache };
