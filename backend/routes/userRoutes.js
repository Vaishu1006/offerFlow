import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {checkRole} from "../middleware/roleMiddleware.js";
import {
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  getProfile,
  changePassword,
  updateUser
} from "../controllers/userController.js";

const router = express.Router();
//for User
router.get("/me", protectRoute, getProfile);
router.patch("/me/changePassword", protectRoute, changePassword);

router.put("/me", protectRoute, updateProfile);


//for Admin
router.get("/", protectRoute, checkRole("admin"), getAllUsers);
router.get("/:id", protectRoute, checkRole("admin"), getUserById);
router.put("/:id", protectRoute, checkRole("admin"), updateUser);
router.delete("/:id", protectRoute, checkRole("admin"), deleteUser);

export default router;