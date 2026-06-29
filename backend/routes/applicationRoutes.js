import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/roleMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", protectRoute, checkRole("student"), createApplication);
router.get("/", protectRoute, getApplications);
router.get("/:id", protectRoute, getApplicationById);
router.put("/:id/status", protectRoute, updateApplicationStatus);
router.put("/:id", protectRoute, updateApplication);
router.delete("/:id", protectRoute, deleteApplication);

export default router;