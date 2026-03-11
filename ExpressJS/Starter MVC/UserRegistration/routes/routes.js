//! Router
//! invoke
//! export

import { Router } from "express";

import {
  displayFormPage,
  displayHomePage,
  submitForm,
} from "../controllers/controller.js";

const router = Router();

//! define all endpoints
router.get("/", displayHomePage);

router.get("/get-form", displayFormPage);

router.post("/register", submitForm);

export default router;
