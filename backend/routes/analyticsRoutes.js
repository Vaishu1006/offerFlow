import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  getDashboardStats,
  getApplicationsByCompany,
  getApplicationsTrend,
  getMyStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", protect, restrictTo("admin"), getDashboardStats);
router.get("/applications-by-company", protect, restrictTo("admin"), getApplicationsByCompany);
router.get("/applications-trend", protect, restrictTo("admin"), getApplicationsTrend);
router.get("/my-stats", protect, restrictTo("student"), getMyStats);

export default router;