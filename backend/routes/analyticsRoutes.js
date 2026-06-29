import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/roleMiddleware.js";
import {
  getDashboardStats,
  getApplicationsByCompany,
  getApplicationsTrend,
  getMyStats,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", protectRoute, checkRole("admin"), getDashboardStats);
router.get("/applications-by-company", protectRoute, checkRole("admin"), getApplicationsByCompany);
router.get("/applications-trend", protectRoute, checkRole("admin"), getApplicationsTrend);
router.get("/my-stats", protectRoute, checkRole("student"), getMyStats);

export default router;