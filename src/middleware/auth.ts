import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { Resp } from "@utils/Response";

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json(Resp.error("Token missing", { status: 401, meta: { timestamp: new Date().toISOString() } }));
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
        res.status(403).json(Resp.error("Invalid token", { status: 403, meta: { timestamp: new Date().toISOString() } }));
        return;
    }
    
    req.user = user;
    next();
  });
};

export const authenticateRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json(Resp.error("Refresh token missing", { status: 401, meta: { timestamp: new Date().toISOString() } }));
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_REFRESH_SECRET!, (err, user) => {
    if (err) {
        res.status(403).json(Resp.error("Invalid refresh token", { status: 403, meta: { timestamp: new Date().toISOString() } }));
        return;
    }
    
    req.user = user;
    next();
  });
};