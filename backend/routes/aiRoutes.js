import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  analyzeApplication,
  getAnalysisByApplication,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/analyze", protect, analyzeApplication);
router.get("/analysis/:applicationId", protect, getAnalysisByApplication);

export default router;