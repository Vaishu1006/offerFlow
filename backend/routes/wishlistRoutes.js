import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  updateWishlistStatus,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", protectRoute, addToWishlist);
router.get("/", protectRoute, getWishlist);
router.put("/:id", protectRoute, updateWishlistStatus);
router.delete("/:id", protectRoute, removeFromWishlist);

export default router;