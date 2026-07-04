import express from "express";

import { protectRoute } from "../middleware/authMiddleware.js";

// Validators
import {
  interviewValidator,
  updateInterviewValidator,
} from "../utils/validators.js";

// Controllers
import {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

import { handleValidationErrors } from "../utils/validators.js";

const router = express.Router();


router.post(
  "/",
  protectRoute,
  interviewValidator,
  handleValidationErrors,
  scheduleInterview
);

router.get(
  "/",
  protectRoute,
  getInterviews
);

router.get(
  "/:id",
  protectRoute,
  getInterviewById
);

router.put(
  "/:id",
  protectRoute,
  updateInterviewValidator,
  handleValidationErrors,
  updateInterview
);

router.delete(
  "/:id",
  protectRoute,
  deleteInterview
);

export default router;