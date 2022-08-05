import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const role = "USER";

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name,
    email,
    password,
    role,
  });

  return user
    .save()
    .then((user) => res.status(201).json({ user }))
    .catch((error) => res.status(500).json({ error }));
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findById(userId)
    .then((user) => (user ? res.status(200).json({ user }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

const getUsers = (req: Request, res: Response, next: NextFunction) => {
  return User.find()
    .then((users) => res.status(200).json({ users }))
    .catch((error) => res.status(500).json({ error }));
};

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findById(userId)
    .then((user) => {
      if (user) {
        user.set(req.body);

        return user
          .save()
          .then((user) => res.status(201).json({ user }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;

  return User.findByIdAndDelete(userId)
    .then((user) => (user ? res.status(201).json({ user, message: "user deleted" }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

export default { createUser, getUser, getUsers, updateUser, deleteUser };
