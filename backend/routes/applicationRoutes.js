import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
  getPendingApplications,
  approveApplication,
} from "../controllers/applicationController.js";
import {
  validateCreateApplication,
  validateUpdateStatus,
  validateUpdateApplication,
} from "../utils/validators.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  checkRole("student"),
  validateCreateApplication,
  createApplication
);

router.get("/", protectRoute, getApplications);

// Admin - View all pending company approval requests
router.get(
  "/pending",
  protectRoute,
  checkRole("admin"),
  getPendingApplications
);

// Admin - Approve a pending application
router.put(
  "/:id/approve",
  protectRoute,
  checkRole("admin"),
  approveApplication
);

router.get("/:id", protectRoute, getApplicationById);

router.put(
  "/:id/status",
  protectRoute,
  validateUpdateStatus,
  updateApplicationStatus
);

router.put(
  "/:id",
  protectRoute,
  validateUpdateApplication,
  updateApplication
);

router.delete("/:id", protectRoute, deleteApplication);



export default router;