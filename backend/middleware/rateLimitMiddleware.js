// middleware/rateLimitMiddleware.js
import rateLimit from "express-rate-limit";

// Strict limiter for login/register — brute-force attacks se bachata hai
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per IP per window
  message: {
    success: false,
    message: "Too many attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Looser limiter for general API routes — spam/abuse se bachata hai
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per IP per window
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});