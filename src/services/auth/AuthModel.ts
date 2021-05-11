import { dbClient } from "../../config/db";

export const createUser = async (
    email: string,
    hashPassword: string,
    refreshToken: string,
) => {

  const res = await dbClient.query(
      'INSERT INTO "users" (email, hash_password, refresh_token) VALUES($1, $2, $3) RETURNING id',
      [email, hashPassword, refreshToken],
      (err, result) => {
        if (err) {
          throw err;
        }
        console.log("frozen cherry", result);
        return result.rows[0].id;
      },
  );
};

export const getByEmail = async (email: string) => {
  const res = await dbClient.query(
      'SELECT * FROM "users" WHERE email=$1',
      [email],
  );
  console.log("real cherry", res);

  return res.rows[0];
};

export const getByRefreshToken = async (refreshToken: string) => {
  const res = await dbClient.query(
      'SELECT * FROM "users" WHERE refresh_token=$1',
      [refreshToken],
  );

  return res.rows[0];
};
