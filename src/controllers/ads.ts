/**
 * @swagger
 * tags:
 *   - name: Ads
 *     description: API related to Ads web application management
 */

import { Request, Response, Router } from "express";
import { authenticateToken } from "@middleware/auth";

import { AdsService } from "@services/ads";

const router: Router = Router();

// Get all ads
router.get("/", async (req: Request, res: Response) => {
    await AdsService.getAllAds(req, res);
});

// Get ad by id
router.get("/:id", async (req: Request, res: Response) => {
    await AdsService.getAdsById(req, res);
});

// Create ad
router.post("/", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.createAds(req, res);
});

// Update ad
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.updateAds(req, res);
});

// Delete ad
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.deleteAds(req, res);
});

export default router;