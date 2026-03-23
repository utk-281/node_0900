//! name, email, phone. isVerified (true -> feedback add)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    phone: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
); //? +2 -> createdAt, updatedAt

const UserModel = mongoose.model("User", userSchema);
//? users

export default UserModel;

//! here validation is at database level
//! req level validation
