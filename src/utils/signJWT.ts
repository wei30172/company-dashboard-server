import jwt from "jsonwebtoken";
import { config } from "../config/config";
import Logging from "../library/Logging";
import { IUser } from "../models/User";

const signJWT = (user: IUser, callback: (error: Error | null, token: string | null) => void): void => {
  Logging.info(`Attempting to sign token for ${user.email}`);

  try {
    jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.issuer,
        algorithm: "HS256",
        expiresIn: config.server.token.expireTime,
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      },
    );
  } catch (error) {
    Logging.error(error);
    callback(error as Error, null);
  }
};

export default signJWT;
