import express from 'express';
import { login, logout, register } from '../controllers/authController.js';
import { me } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router=express.Router();
router.post("/register", protectRoute, register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/me", me);

export default router;