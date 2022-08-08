import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User";
import Logging from "../library/Logging";
import { config } from "../config/config";
import { ROLES } from "../config/rolesList";
import { getAccessToken, getRefreshToken } from "../utils/signJWT";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  Logging.info("Token validated, user authorized.");
  return res.status(200).json({ message: "Authorized" });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  let { firstName, lastName, email, password, confirmPassword } = req.body;
  const role = ROLES.USER;

  if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" });

  // check for duplicate email in the db
  const foundUser = await User.findOne({ email });
  if (foundUser) return res.status(409).json({ message: "The email is already registered" });

  try {
    //encrypt the password
    const hashedPwd = await bcryptjs.hash(password, 10);

    //create and store the new user
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPwd,
      role,
    });

    return user.save().then((user) => res.status(201).json({ user }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  let { email, password } = req.body;

  // check for registered email in the db
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(401).json({ message: "Unauthorized, That email is not registered" });

  try {
    // evaluate the password
    const match = await bcryptjs.compare(password, foundUser.password);
    if (match) {
      // create JWTs
      const accessToken = getAccessToken(foundUser);

      // Saving refreshToken with current user
      if (accessToken) {
        // Creates Secure Cookie with refresh token
        const refreshToken = getRefreshToken(foundUser);
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          // secure: true,
          sameSite: true,
          maxAge: 24 * 60 * 60 * 1000, // 1day
        });

        foundUser.set({ ...foundUser, refreshToken });
        foundUser.save().then((user) =>
          res.status(201).json({
            message: "Authorized successfully",
            accessToken,
            user,
          }),
        );
      }
    } else {
      return res.status(401).json({ message: "Unauthorized, That password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  // Delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  try {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        // secure: true,
        sameSite: true,
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    res.clearCookie("jwt", {
      httpOnly: true,
      // secure: true,
      sameSite: true,
    });
    foundUser.set({ ...foundUser, refreshToken: "" });
    foundUser.save().then((user) =>
      res.status(201).json({
        message: "Logout successfully",
        refreshToken: user.refreshToken,
      }),
    );
  } catch (error) {
    res.status(500).json({ error });
  }
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  // console.log(cookies.jwt);
  const refreshToken = cookies.jwt;

  // evaluate jwt
  if (refreshToken) {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); // Forbidden

    jwt.verify(refreshToken, config.server.token.refreshSecret, (error: jwt.VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
      if (error) {
        return res.status(403);
      } else {
        const accessToken = getAccessToken(foundUser);
        if (accessToken) {
          res.status(200).json({
            message: "RefreshToken successfully",
            accessToken,
          });
        }
      }
    });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export default { validateToken, register, login, logout, refreshToken };
