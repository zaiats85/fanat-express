import { Request, Response } from "express";
import {
  authenticate,
  generateAccessToken,
  registerNewUser,
} from "./AuthController";

const options = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 * 90, // would expire after 90 days
  path: "/api/v1/refresh",
  secure: false,
  signed: false,
};

export default [
  {
    handler: [
      async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await registerNewUser(
            email,
            password,
        );

        res
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .send({ auth: true, accessToken });
      },
    ],
    method: "post",
    path: "/api/v1/signup",
  },
  {
    handler: [
      async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { accessToken, refreshToken } = await authenticate(email, password);

        res
            .cookie("refreshToken", refreshToken, options)
            .status(200)
            .send({ auth: true, accessToken });
      },
    ],
    method: "post",
    path: "/api/v1/signin",
  },
  {
    handler: [
      async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies;
        const accessToken = generateAccessToken(refreshToken);

        res.status(200).send({ auth: true, accessToken });
      },
    ],
    method: "get",
    path: "/api/v1/refresh/token",
  },
  {
    handler: [
      (req: Request, res: Response) => {
        res.status(200).send(`
          <h1>Create new user</h1>
          <form action="/api/v1/signup" method="POST">
              <div style="margin-bottom: 10px">
                <label for="email">Your email:</label>
                <input id="email" name="email" type="text" />
              </div>
              <div style="margin-bottom: 10px">
                <label for="password">Your password:</label>
                <input id="password" name="password" type="password" />
              </div>

              <input type="hidden" name="_csrf" value="${req.csrfToken()}" />
              <input type="submit" value="Submit" />
          </form>
        `);
      },
    ],
    method: "get",
    path: "/",
  },
  {
    handler: [
      (req: Request, res: Response) => {
      console.log("wdcwdcwd");
      res.status(200).send(`
          <h1>Login</h1>
          <form action="/api/v1/signin" method="POST">
              <div style="margin-bottom: 10px">
                <label for="email">Your email:</label>
                <input id="email" name="email" type="text" />
              </div>
              <div style="margin-bottom: 10px">
                <label for="password">Your password:</label>
                <input id="password" name="password" type="password" />
              </div>

              <input type="hidden" name="_csrf" value="${req.csrfToken()}" />
              <input type="submit" value="Submit" />
          </form>
        `);
      },
    ],
    method: "get",
    path: "/login",
  },
];
