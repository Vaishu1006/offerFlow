import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resumeController.js";

const router = express.Router();

router.post("/", protectRoute, uploadResume);
router.get("/", protectRoute, getResumes);
router.get("/:id", protectRoute, getResumeById);
router.delete("/:id", protectRoute, deleteResume);

export default router;