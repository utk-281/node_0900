import { Router } from "express";

import {
  deleteFeedback,
  getFeedback,
  getFeedbacks,
  submitFeedback,
  updateFeedback,
} from "../controllers/feedback-controller.js";

const router = Router();

router.post("/submit", submitFeedback);

router.get("/all", getFeedbacks);

router.get("/one/:feedbackId", getFeedback);
//? ":id" -> dynamic routing

router.patch("/edit/:feedbackId", updateFeedback);

router.delete("/delete/:feedbackId", deleteFeedback);

export default router;

/// http://localhost:9000/API_VERSION/one/89asdhasohkjnak

//~ put -> it is used to update the entire resource
//~ patch -> it is used to update partial resource

let data = {
  name: "a",
  age: "34",
  email: "a@gmail.com",
};

//? updating age with put -> req.body.age --> {age:35}
//? updating age with patch -> req.body.age --> {age:35, name:"a", email:""}
