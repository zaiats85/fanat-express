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
  /* SIGN UP */
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
  /* SIGN IN */
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
  /* REFRESH TOKEN */
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
  /* CREATE NEW USER */
  {
    handler: [
      (req: Request, res: Response) => {
        res.status(200).send(`
          <h1>new User</h1>
          <form action="/api/v1/signup" method="POST">
              <div style="margin-bottom: 10px">
                <label for="email">Your email:</label>
                <input id="email" name="email" type="text" />
              </div>
              <div style="margin-bottom: 10px">
                <label for="password">Your password:</label>
                <input id="password" name="password" type="password" />
              </div>
              <div style="margin-bottom: 10px">
                <span>
                    <a href="/login"
                       style="text-decoration: none">
                       Already registered?
                    </a>
                </span>
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
  /* LOGIN */
  {
    handler: [
      (req: Request, res: Response) => {
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
              <div style="margin-bottom: 10px">
                   <span>
                        <a href="/"
                            style="text-decoration: none">
                            Don't have an account yet?
                        </a>
                   </span>
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
