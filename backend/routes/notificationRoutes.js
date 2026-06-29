import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import restrictTo from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", protect, restrictTo("admin"), createNotification);
router.get("/", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;