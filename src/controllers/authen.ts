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

// Google Authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
    try {
        const user = req.user as { token: string, newrefreshToken: string };

        res.status(200).json(Resp.success({ accessToken: user.token, refreshToken: user.newrefreshToken }, "Google Authentication Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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

        res.status(500).json(Resp.error("Failed to authenticate google", errorOptions));
    }
});

// Discord Authentication
router.get('/discord', passport.authenticate('discord'));
router.get('/discord/callback', passport.authenticate('discord', { session: false }), (req, res) => {
    try {
        const user = req.user as { token: string, newrefreshToken: string };

        res.status(200).json(Resp.success({ accessToken: user.token, refreshToken: user.newrefreshToken }, "Discord Authentication Success", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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

        res.status(500).json(Resp.error("Failed to authenticate discord", errorOptions));
    }
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