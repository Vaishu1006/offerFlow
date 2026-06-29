import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/roleMiddleware.js";
import {
  scheduleInterview,
  getInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/", protectRoute, checkRole("admin", "mentor"), scheduleInterview);
router.get("/", protectRoute, getInterviews);
router.get("/:id", protectRoute, getInterviewById);
router.put("/:id", protectRoute, checkRole("admin", "mentor"), updateInterview);
router.delete("/:id", protectRoute, checkRole("admin", "mentor"), deleteInterview);

export default router;