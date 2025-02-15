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

/**
 * @swagger
 * /api/advertise:
 *   get:
 *     summary: Get all ads
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: Get all ads
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.get("/", async (req: Request, res: Response) => {
    await AdsService.getAllAds(req, res);
});

// Get ad by id

/**
 * @swagger
 * /api/advertise/{id}:
 *   get:
 *     summary: Get ad by id
 *     tags: [Ads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ad to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get ad by id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ad not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/:id", async (req: Request, res: Response) => {
    await AdsService.getAdsById(req, res);
});

// Create ad

/**
 * @swagger
 * /api/advertise:
 *   post:
 *     summary: Create ad
 *     tags: [Ads]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - link
 *               - image
 *               - backgroundColor
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the ad
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 description: The description of the ad
 *                 minLength: 1
 *               link:
 *                 type: string
 *                 description: The link associated with the ad
 *                 minLength: 1
 *               image:
 *                 type: string
 *                 description: The URL of the ad image
 *                 minLength: 1
 *               backgroundColor:
 *                 type: string
 *                 description: The background color of the ad
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Advertisement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Ad created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: New Ad
 *                     description:
 *                       type: string
 *                       example: This is a new ad
 *                     link:
 *                       type: string
 *                       example: https://example.com
 *                     image:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     backgroundColor:
 *                       type: string
 *                       example: "#FFFFFF"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *       400:
 *         description: Bad request (missing required fields or validation failure)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Title is required
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 400
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

router.post("/", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.createAds(req, res);
});

// Update ad

/**
 * @swagger
 * /api/advertise/{id}:
 *   put:
 *     summary: Update ad
 *     tags: [Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ad to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - link
 *               - image
 *               - backgroundColor
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the ad
 *                 minLength: 1
 *               description:
 *                 type: string
 *                 description: The description of the ad
 *                 minLength: 1
 *               link:
 *                 type: string
 *                 description: The link associated with the ad
 *                 minLength: 1
 *               image:
 *                 type: string
 *                 description: The URL of the ad image
 *                 minLength: 1
 *               backgroundColor:
 *                 type: string
 *                 description: The background color of the ad
 *                 minLength: 1
 *     responses:
 *       200:
 *         description: Advertisement updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Ad updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Updated Ad
 *                     description:
 *                       type: string
 *                       example: This is an updated ad
 *                     link:
 *                       type: string
 *                       example: https://example.com
 *                     image:
 *                       type: string
 *                       example: https://example.com/updated_image.jpg
 *                     backgroundColor:
 *                       type: string
 *                       example: "#FFFFFF"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *       400:
 *         description: Bad request (invalid or missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Invalid id format
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 400
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *       404:
 *         description: Ad not found by the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: No ads found by id 1
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 404
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: An error occurred
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 500
 *                     error:
 *                       type: string
 *                       example: Error message here
 *                     stack:
 *                       type: string
 *                       example: Error stack trace here
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-15T00:00:00.000Z"
 */

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.updateAds(req, res);
});

// Delete ad

/**
 * @swagger
 * /api/advertise/{id}:
 *   delete:
 *     summary: Delete ad
 *     tags: [Ads]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ad to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete ad
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ad not found
 *       500:
 *         description: Internal Server Error
 */

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    await AdsService.deleteAds(req, res);
});

export default router;