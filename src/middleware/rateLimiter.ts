import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts. Please try again later." },
  standardHeaders: true, // ส่งข้อมูล rate limit ผ่าน headers
  legacyHeaders: false, // ปิด X-RateLimit-* headers แบบเก่า
});