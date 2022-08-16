import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  role: string;
  name: string;
  email: string;
  password: string;
  refreshToken: string[];
}

export interface IRegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    role: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: [String] },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<IUserModel>("User", UserSchema);
