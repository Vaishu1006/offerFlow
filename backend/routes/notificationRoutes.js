import express from "express";

import { protectRoute } from "../middleware/authMiddleware.js";

import {
  getMyNotifications,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get(
  "/",
  protectRoute,
  getMyNotifications
);

router.patch(
  "/:id/read",
  protectRoute,
  markAsRead
);

router.delete(
  "/:id",
  protectRoute,
  deleteNotification
);

export default router;