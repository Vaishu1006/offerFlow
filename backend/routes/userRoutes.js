import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import {
  me,
  updateMyProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protectRoute, me);
router.put("/me", protectRoute, updateMyProfile);

router.get("/", protectRoute, checkRole("Admin"), getAllUsers);
router.get("/:id", protectRoute, checkRole("Admin"), getUserById);
router.delete("/:id", protectRoute, checkRole("Admin"), deleteUser);

export default router;