import jwt from 'jsonwebtoken';

interface TokenPayload {
  [key: string]: any; // กำหนดว่า payload สามารถมี key อะไรก็ได้
}

// ฟังก์ชันสร้าง Access Token
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '15m' });
};

// ฟังก์ชันสร้าง Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
};