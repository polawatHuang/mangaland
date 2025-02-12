"use strict";
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: User authentication and login to get access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Invalid credentials or bad request.
 *       500:
 *         description: Internal server error
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * /api/auth/@me:
 *   get:
 *     summary: Get the user profile
 *     description: Retrieve the authenticated user's profile information using the access token.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: User ID
 *                 username:
 *                   type: string
 *                   description: Username of the user
 *                 email:
 *                   type: string
 *                   description: Email address of the user
 *       401:
 *         description: Unauthorized, invalid or missing access token.
 *       500:
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
const express_1 = require("express");
const Response_1 = require("@utils/Response");
const authen_1 = __importDefault(require("@services/auth/authen"));
const auth_1 = require("@middleware/auth");
const GenerateToken_1 = require("@utils/GenerateToken");
const router = (0, express_1.Router)();
router.post('/login', (req, res, next) => {
    authen_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err)
            return res.status(500).json({ error: "Internal Server Error" });
        if (!user)
            return res.status(401).json({ error: (info === null || info === void 0 ? void 0 : info.message) || "Authentication failed" });
        try {
            const accessToken = (0, GenerateToken_1.generateAccessToken)(user);
            const refreshToken = (0, GenerateToken_1.generateRefreshToken)(user);
            res.status(200).json(Response_1.Resp.success({ accessToken, refreshToken }, "Login Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        }
        catch (error) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Response_1.Resp.error("Failed to login", errorOptions));
        }
    })(req, res, next);
});
router.get('/@me', auth_1.authenticateToken, (req, res) => {
    try {
        res.status(200).json(Response_1.Resp.success(req.user, "User Profile", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to get user profile", errorOptions));
    }
});
router.get('/refresh', auth_1.authenticateRefreshToken, (req, res) => {
    try {
        // const user = req.user as { id: string, username: string, email: string, avatar: string, provider: string };
        // const accessToken  = generateRefreshToken(user);
        // const newRefreshToken  = generateRefreshToken(user);
        res.status(200).json(Response_1.Resp.success(req.user, "Refresh Token Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to refresh token", errorOptions));
    }
});
exports.default = router;
