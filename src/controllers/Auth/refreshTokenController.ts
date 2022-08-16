import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { config } from "../../config/config";
import { getAccessToken, getRefreshToken } from "../../utils/signJWT";

export interface RefreshTokenPayload {
  email: string;
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: true,
  });

  if (refreshToken) {
    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse
    if (!foundUser) {
      jwt.verify(refreshToken, config.server.token.refreshSecret, async (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
        if (error) {
          return res.sendStatus(403); //Forbidden
        } else {
          console.log("attempted refresh token reuse!");
          const hackedUser = await User.findOne({ email: (decoded as RefreshTokenPayload).email }).exec();
          if (hackedUser) {
            hackedUser.refreshToken = [];
            const result = await hackedUser.save();
            console.log(result);
          }
        }
      });
      return res.sendStatus(403); // Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

    // evaluate jwt
    jwt.verify(refreshToken, config.server.token.refreshSecret, async (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (error) {
        console.log("expired refresh token");
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        console.log(result);
      }

      if (error || foundUser.email !== (decoded as RefreshTokenPayload).email) return res.sendStatus(403); // Forbidden

      // Refresh token was still valid
      const accessToken = getAccessToken(foundUser);
      const newRefreshToken = getRefreshToken(foundUser);

      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const user = await foundUser.save();
      console.log(user);

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000, // 1day
      });

      res.json({ accessToken, user: { role: user.role, name: user.name, email: user.email } });
    });
  }
};

export default refreshToken;
