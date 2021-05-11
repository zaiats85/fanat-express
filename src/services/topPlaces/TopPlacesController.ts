import { getPlaces } from "./TopPlacesModel";
import { redisClient } from "../../config/cache";

export const getTopPlaces = async (offset: number, limit: number) => {
  const result = await getPlaces(offset, limit);
  const key = `key-${offset}-${limit};`;
  redisClient.set(key, JSON.stringify(result));
  return result;
};
