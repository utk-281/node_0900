//! Router
//! invoke
//! export

import { Router } from "express";

import {
  displayFormPage,
  displayHomePage,
  getAllUsers,
  submitForm,
} from "../controllers/controller.js";

const router = Router();

//! define all endpoints
router.get("/", displayHomePage);

router.get("/get-form", displayFormPage);

router.post("/register", submitForm);

router.get("/all", getAllUsers);

export default router;

// http://localhost:9000/api/v1/get-form -> api (data exchange)
