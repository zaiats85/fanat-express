import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import randtoken from "rand-token";
import { HTTP400Error, HTTP401Error } from "../../utils/httpErrors";
import { createUser, getByEmail, getByRefreshToken } from "./AuthModel";

const TOKEN_CONFIG: SignOptions = {
  algorithm: "HS256",
  expiresIn: 300,
};
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const registerNewUser = async (email: string, password: string): Promise<any | Error> => {
  if (!email || !password) {
    throw new HTTP400Error();
  }

  const hashPassword = bcrypt.hashSync(password, 8);
  const refreshToken = randtoken.uid(256);

  try {
    const id = await createUser(email, hashPassword, refreshToken);

    const accessToken = jwt.sign({ sub: id }, JWT_SECRET, TOKEN_CONFIG);

    return { accessToken, refreshToken };
  } catch (e) {
    throw new HTTP400Error("This email already exists");
  }
};

export const authenticate = async (email: string, password: string): Promise<any | Error> => {
  if (!email || !password) {
    throw new HTTP400Error();
  }

  const user = await getByEmail(email);

  if (!user || !bcrypt.compareSync(password, user.hash_password)) {
    throw new HTTP401Error();
  }

  const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, TOKEN_CONFIG);
  return { accessToken, refreshToken: user.refresh_token };
};

export const generateAccessToken = async (refreshToken: string): Promise<string | Error> => {
  const user = await getByRefreshToken(refreshToken);

  if (!user) {
    throw new HTTP401Error();
  }

  return jwt.sign({ sub: user.id }, JWT_SECRET, TOKEN_CONFIG);
};
