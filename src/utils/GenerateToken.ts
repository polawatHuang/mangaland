import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const { iat, exp, ...tokenPayload } = payload;

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }

  const { iat, exp, ...tokenPayload } = payload;

  return jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};