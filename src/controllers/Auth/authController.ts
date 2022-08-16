import { NextFunction, Request, Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../../models/User";
import { getAccessToken, getRefreshToken } from "../../utils/signJWT";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  // check for email and password
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  // check for registered email in the db
  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(401).json({ message: "Unauthorized, That email is not registered" });

  // evaluate the password
  const match = await bcryptjs.compare(password, foundUser.password);
  if (match) {
    // create JWTs
    const accessToken = getAccessToken(foundUser);
    const newRefreshToken = getRefreshToken(foundUser);

    let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    // Detected refresh token reuse
    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        console.log("attempted refresh token reuse at login!");

        // clear out all previous refresh tokens
        newRefreshTokenArray = [];

        res.clearCookie("jwt", {
          httpOnly: true,
          secure: true,
          sameSite: true,
        });
      }
    }

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
  } else {
    return res.status(401);
  }
};

export default login;
