import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", protect, restrictTo("admin", "mentor"), scheduleInterview);
router.get("/", protect, getInterviews);
router.get("/:id", protect, getInterviewById);
router.put("/:id", protect, restrictTo("admin", "mentor"), updateInterview);
router.delete("/:id", protect, restrictTo("admin", "mentor"), deleteInterview);

export default router;