import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  analyzeApplication,
  getAnalysisByApplication,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", protectRoute, analyzeApplication);
router.get("/analysis/:applicationId", protectRoute, getAnalysisByApplication);

export default router;