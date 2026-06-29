import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  updateWishlistStatus,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/", protect, addToWishlist);
router.get("/", protect, getWishlist);
router.put("/:id", protect, updateWishlistStatus);
router.delete("/:id", protect, removeFromWishlist);

export default router;