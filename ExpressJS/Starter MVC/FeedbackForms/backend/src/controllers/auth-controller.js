import UserModel from "../models/user-model.js";
import { generateJWT } from "../utils/jwt-util.js";

export const register = async (req, res, next) => {
  try {
    let { name, email, password, phone } = req.body;

    // let salt = await bcryptjs.genSalt(10);
    // console.log("salt: ", salt);

    // let hashedPassword = await bcryptjs.hash(password, salt);
    // console.log("hashedPassword: ", hashedPassword);

    let newUser = await UserModel.create({
      name,
      email,
      password /* : hashedPassword, */,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  let { email, password } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" });

  //! verify the password
  //   let isMatched = await bcryptjs.compare(password, user.password);
  let isMatched = await user.comparePassword(password);
  //   console.log("isMatched: ", isMatched);

  if (!isMatched)
    return res
      .status(400)
      .json({ success: false, message: "Invalid Credentials" }); // isMatched == false

  let token = generateJWT(user._id);
  //   console.log("token: ", token);

  res.cookie("token", token, {});

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
  });
};

export const logout = async (req, res, next) => {};

export const updateProfile = async (req, res, next) => {};

export const deleteProfile = async (req, res, next) => {};
