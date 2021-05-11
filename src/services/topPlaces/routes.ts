import { NextFunction, Request, Response } from "express";
import { getFromCache } from "../../middleware/caching";
import { HTTP400Error } from "../../utils/httpErrors";
import { getTopPlaces } from "./TopPlacesController";

const checkParams = (req: Request, res: Response, next: NextFunction) => {
  const { offset, limit } = req.query;
  if (!offset || !limit) {
    throw new HTTP400Error("Missing parameters: offset/limit");
  } else {
    next();
  }
};

export default [
  {
    handler: [
      checkParams,
      (req: Request, res: Response, next: NextFunction) => {
        const { offset = 0, limit = 0 } = req.query;
        const key = `key-${offset}-${limit};`;
        getFromCache(key, res, next);
      },
      async ({ query }: Request, res: Response) => {
        const { offset = 0, limit = 0 } = query;
        const result = await getTopPlaces(+offset, +limit);
        res.status(200).send(result);
      },
    ],
    method: "get",
    path: "/api/v1/topPlaces",
  },
];
