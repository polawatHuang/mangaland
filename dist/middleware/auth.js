"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateRefreshToken = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Response_1 = require("@utils/Response");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json(Response_1.Resp.error("Token missing", { status: 401, meta: { timestamp: new Date().toISOString() } }));
        return;
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            res.status(403).json(Response_1.Resp.error("Invalid token", { status: 403, meta: { timestamp: new Date().toISOString() } }));
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
const authenticateRefreshToken = (req, res, next) => {
    // const { refreshToken } = req.query as { refreshToken: string };
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json(Response_1.Resp.error("Refresh token missing", { status: 401, meta: { timestamp: new Date().toISOString() } }));
        return;
    }
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            res.status(403).json(Response_1.Resp.error("Invalid refresh token", { status: 403, meta: { timestamp: new Date().toISOString() } }));
            return;
        }
        req.user = user;
        next();
    });
};
exports.authenticateRefreshToken = authenticateRefreshToken;
