import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import randtoken from "rand-token";
import { HTTP400Error, HTTP401Error } from "../../utils/httpErrors";

dotenv.config();

let id = 1;
const getId = () => id++;
const users = new Map();
const JWT_SECRET = process.env.JWT_SECRET_KEY as string;

export const registerNewUser = (email: string, password: string) => {
  if (!email || !password) {
    throw new HTTP400Error();
  }

  const hashPassword = bcrypt.hashSync(password, 8);
  const refreshToken = randtoken.uid(256);
  getId();
  users.set(email, { hashPassword, id, refreshToken });

  const accessToken = jwt.sign({ sub: id }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: 300,
  });

  return { accessToken, refreshToken };
};

export const authenticate = (email: string, password: string) => {
  if (!email || !password) {
    throw new HTTP400Error();
  }

  const user = users.get(email);

  if (!user || !bcrypt.compareSync(password, user.hash_password)) {
    throw new HTTP401Error();
  }

  const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: 300,
  });

  const { refreshToken } = user;

  return { accessToken, refreshToken };
};

export const generateAccessToken = (refreshToken: string) => {
  const user = Array.from(users.values()).find(
      (it) => it.refreshToken === refreshToken,
  );

  if (!user) {
    throw new HTTP401Error();
  }

  const accessToken = jwt.sign({ sub: user.id }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: 300,
  });

  return accessToken;
};
