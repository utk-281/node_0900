import { Router } from "express";

import {
  deleteProfile,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
} from "../controllers/auth-controller.js";

import { authenticate } from "../middlewares/auth-middleware.js";

import { validateBody } from "../middlewares/validate-body-middleware.js";

import {
  loginUserSchema,
  registerUserSchema,
  updateProfileSchema,
} from "../validators/user-validator.js";

const router = Router();

router.post("/register", validateBody(registerUserSchema), register);

router.post("/login", validateBody(loginUserSchema), login);

router.post("/logout", authenticate, logout); //? injecting the middleware, whenever req is made for "/logout", first it will go through authenticate middleware

router.patch(
  "/update-profile",
  authenticate,
  validateBody(updateProfileSchema),
  updateProfile,
);

router.patch("/update-password", authenticate, updatePassword);

router.delete("/delete", authenticate, deleteProfile);

export default router;
