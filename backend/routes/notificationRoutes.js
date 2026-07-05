import express from "express";

import { protectRoute } from "../middleware/authMiddleware.js";

import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * ==========================================
 * GET ALL NOTIFICATIONS
 * GET /api/notifications
 * ==========================================
 */
router.get(
  "/",
  protectRoute,
  getMyNotifications
);

/**
 * ==========================================
 * MARK NOTIFICATION AS READ
 * PATCH /api/notifications/:id/read
 * ==========================================
 */
router.patch(
  "/:id/read",
  protectRoute,
  markAsRead
);

/**
 * ==========================================
 * DELETE NOTIFICATION
 * DELETE /api/notifications/:id
 * ==========================================
 */
router.delete(
  "/:id",
  protectRoute,
  deleteNotification
);

export default router;