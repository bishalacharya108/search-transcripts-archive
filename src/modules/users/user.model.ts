import { model } from "mongoose";
import { models } from "mongoose";
import { TUser } from "./user.interface";
import { Schema } from "mongoose";
export const UserSchema = new Schema<TUser>({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "contributor", "viewer"],
    default: "viewer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: {
    type: String,
  },
  forgotPasswordTokenExpiry: {
    type: Date,
  },
  verifyToken: {
    type: String,
  },
  verifyTokenExpiry: {
    type: Date,
  },
});

export const User = models.User || model<TUser>("User", UserSchema);
