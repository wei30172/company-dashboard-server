import jwt from "jsonwebtoken";
import { config } from "../config/config";
import Logging from "../library/Logging";
import { IUser } from "../models/User";

export const getAccessToken = (user: IUser) => {
  Logging.info(`Attempting to get access token for ${user.email}`);

  const accessToken = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    config.server.token.accessSecret,
    {
      issuer: config.server.token.issuer,
      algorithm: "HS256",
      expiresIn: "60s",
    },
  );

  return accessToken;
};

export const getRefreshToken = (user: IUser) => {
  Logging.info(`Attempting to get refresh token  for ${user.email}`);

  const refreshToken = jwt.sign(
    {
      email: user.email,
    },
    config.server.token.refreshSecret,
    {
      issuer: config.server.token.issuer,
      algorithm: "HS256",
      expiresIn: "1d",
    },
  );

  return refreshToken;
};
