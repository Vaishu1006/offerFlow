import express from 'express';
import { login, logout, register } from '../controllers/authController.js';

import { protectRoute } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimitMiddleware.js';

const router=express.Router();
router.post("/register",authLimiter, register);
router.post("/login",authLimiter, login);
router.post("/logout", logout);


export default router;