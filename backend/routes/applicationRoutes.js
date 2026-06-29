import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", protect, restrictTo("student"), createApplication);
router.get("/", protect, getApplications);
router.get("/:id", protect, getApplicationById);
router.put("/:id/status", protect, updateApplicationStatus);
router.put("/:id", protect, updateApplication);
router.delete("/:id", protect, deleteApplication);

export default router;