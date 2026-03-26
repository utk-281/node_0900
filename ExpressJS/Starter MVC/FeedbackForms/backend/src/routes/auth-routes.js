import { Router } from "express";

import {
  deleteProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/auth-controller.js";

import { authenticate } from "../middlewares/auth-middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", authenticate, logout); //? injecting the middleware, whenever req is made for "/logout", first it will go through authenticate middleware

router.patch("/update", authenticate, updateProfile);

router.patch("/delete", authenticate, deleteProfile);

export default router;
