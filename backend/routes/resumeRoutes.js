// resumeRoutes.js
import express from "express";
import { uploadResume, getResumes, getResumeById, deleteResume } from "../controllers/resumeController.js";
import { protectRoute } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, upload.single("resume"), uploadResume);
router.get("/", protectRoute, getResumes);
router.get("/:id", protectRoute, getResumeById);
router.delete("/:id", protectRoute, deleteResume);


export default router;