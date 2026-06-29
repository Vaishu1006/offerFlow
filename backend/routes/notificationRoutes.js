import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/roleMiddleware.js";
import {
  createNotification,
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/", protectRoute, checkRole("admin"), createNotification);
router.get("/", protectRoute, getMyNotifications);
router.put("/:id/read", protectRoute, markAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;