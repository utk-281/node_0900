//! name, email, phone. isVerified (true -> feedback add)
import bcryptjs from "bcryptjs";
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

//! for password hashing -> 2nd method (this is one way hashing -> original data is not recoverable)
userSchema.pre("save", async function () {
  let salt = await bcryptjs.genSalt(10);
  let hashedPassword = await bcryptjs.hash(this.password, salt);
  // console.log("hashedPassword: ", hashedPassword);
  this.password = hashedPassword;
  // console.log(this);
});

//? to define our own methods
// schemaName.methods.methodName = function(){}
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcryptjs.compare(enteredPassword, this.password);
};

const UserModel = mongoose.model("User", userSchema);
//? users

export default UserModel;

//! here validation is at database level
//! req level validation

//! for password hashing -> bcryptjs
//! 1) write the code for password hashing inside model.js
//! 2) write the code for password hashing inside controller.js

//! for password verifying -> bcryptjs
//! 1) write the code for password hashing inside model.js
//! 2) write the code for password hashing inside controller.js
