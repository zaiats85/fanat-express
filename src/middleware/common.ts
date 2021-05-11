import bodyParser from "body-parser";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Router } from "express";

export const handleCors = (router: Router) =>
    router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
};

export const handleCompression = (router: Router) => {
  router.use(compression());
};

export const handleCookie = (router: Router) => {
  router.use(cookieParser());
};
