//! ** perform these three steps for each route file**

//! 1) import Router from express
import { Router } from "express";
import {
  displayAboutPage,
  displayHomePage,
  sendJSON,
} from "../controllers/controller.js";

//! 2) invoke the Router class/interface
let router = Router();

router.get("/", displayHomePage);

router.get("/about", displayAboutPage);

router.get("/json", sendJSON);

//! 3) export this router variable
export default router;
