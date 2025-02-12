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

import { Request, Response, Router } from "express";
import { Resp, ResponseOptions } from "@utils/Response";
import passport from "@services/auth/authen";

import { authenticateRefreshToken, authenticateToken } from "@middleware/auth";
import { generateAccessToken, generateRefreshToken } from "@utils/GenerateToken";

interface CustomResponseOptions extends ResponseOptions {
    timestamp?: string;
    error?: string;
    meta?: {
        status: number;
        stack?: string;
        [key: string]: any;
    };
}

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
      if (err) return res.status(500).json({ error: "Internal Server Error" });
      if (!user) return res.status(401).json({ error: info?.message || "Authentication failed" });
  
      try {
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
  
        res.status(200).json(Resp.success({ accessToken, refreshToken }, "Login Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
      } catch (error: any) {
        const errorOptions: CustomResponseOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };

        res.status(500).json(Resp.error("Failed to login", errorOptions));   
      }
    })(req, res, next);
});

router.get('/@me', authenticateToken, (req: Request, res: Response) => {
    try {
        res.status(200).json(Resp.success(req.user, "User Profile", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    } catch (error: any) {
        const errorOptions: CustomResponseOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };

        res.status(500).json(Resp.error("Failed to get user profile", errorOptions));        
    }
});

router.get('/refresh', authenticateRefreshToken, (req: Request, res: Response) => {
    try {
        // const user = req.user as { id: string, username: string, email: string, avatar: string, provider: string };
        // const accessToken  = generateRefreshToken(user);
        // const newRefreshToken  = generateRefreshToken(user);

        res.status(200).json(Resp.success(req.user, "Refresh Token Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    } catch (error: any) {
        const errorOptions: CustomResponseOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };

        res.status(500).json(Resp.error("Failed to refresh token", errorOptions));
    }
});

export default router;