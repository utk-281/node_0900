import { Router } from "express";

import { submitFeedback } from "../controllers/feedback-controller.js";

const router = Router();

router.post("/submit", submitFeedback);

export default router;

/// http://localhost:9000/API_VERSION/ENDPOINT
