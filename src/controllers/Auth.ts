import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import bcryptjs from "bcryptjs";
import Logging from "../library/Logging";
import signJWT from "../utils/signJWT";

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  Logging.info("Token validated, user authorized.");
  return res.status(200).json({ message: "Authorized" });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  let { name, email, password } = req.body;
  const role = "USER";

  const user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: "That email is already registered" });

  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({ error: hashError });
    }

    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password: hash,
      role,
    });

    return user
      .save()
      .then((user) => res.status(201).json({ user }))
      .catch((error) => res.status(500).json({ error }));
  });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  let { email, password } = req.body;

  User.find({ email })
    .exec()
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).json({ message: "Unauthorized, That email is not registered" });
      }

      bcryptjs.compare(password, users[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({ message: "Unauthorized, That password is incorrect" });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error) {
              return res.status(500).json({ error: _error });
            } else if (token) {
              return res.status(200).json({
                message: "Authorized successfully",
                token: token,
                user: users[0],
              });
            }
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

export default { validateToken, register, login };
