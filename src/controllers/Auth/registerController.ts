import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import User from "../../models/User";
import { ROLES } from "../../config/rolesList";

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

    return user.save().then(() => res.status(201).json({ message: "Register Successfully!" }));
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default register;
