/**
 * @swagger
 * tags:
 *   - name: Episode
 *     description: API related to episode management
 */

import { Request, Response, Router } from "express";
import { authenticateToken } from "@middleware/auth";
import { EpisodeService } from "@services/episode";

const router: Router = Router();

// Get all episodes
/**
 * @swagger
 * /api/episode:
 *   get:
 *     summary: Get all episodes
 *     tags: [Episode]
 *     responses:
 *       200:
 *         description: List of episodes retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
router.get("/", async (req: Request, res: Response) => {
  await EpisodeService.getAllEpisodes(req, res);
});

// Get episode by ID
/**
 * @swagger
 * /api/episode/{id}:
 *   get:
 *     summary: Get an episode by ID or Episode Number
 *     tags: [Episode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the episode or Episode Number
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Episode retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Invalid ID format or missing parameter
 *       404:
 *         description: Episode not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", async (req: Request, res: Response) => {
  await EpisodeService.getEpisodeById(req, res);
});

// Get episodes by project slug
/**
 * @swagger
 * /api/episode/project/{slug}:
 *   get:
 *     summary: Get episodes by project slug
 *     tags: [Episode]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug of the project
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Episodes retrieved successfully
 *       400:
 *         description: Invalid slug format or missing parameter
 *       404:
 *         description: Episodes not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/project/:slug", async (req: Request, res: Response) => {
  await EpisodeService.getEpisodesByProject(req, res);
});

// Get episode by Slug and Episode Number
/**
 * @swagger
 * /api/episode/{slug}/{episodeNumber}:
 *   get:
 *     summary: Get an episode by Slug and Episode Number
 *     tags: [Episode]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Slug of the episode
 *         schema:
 *           type: string
 *       - in: path
 *         name: episodeNumber
 *         required: true
 *         description: Episode number of the series
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Episode retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Invalid parameters
 *       404:
 *         description: Episode not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:slug/:episodeNumber", async (req: Request, res: Response) => {
  await EpisodeService.getEpisodeByEp(req, res);
});

// Create a new episode
/**
 * @swagger
 * /api/episode:
 *   post:
 *     summary: Create a new episode
 *     tags: [Episode]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - episodeNumber
 *               - title
 *             properties:
 *               projectId:
 *                 type: integer
 *                 description: Project ID associated with the episode
 *               episodeNumber:
 *                 type: integer
 *                 description: Episode number
 *               title:
 *                 type: string
 *                 description: Title of the episode
 *               description:
 *                 type: string
 *                 description: Description of the episode
 *     responses:
 *       201:
 *         description: Episode created successfully
 *       500:
 *         description: Internal Server Error
 */

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  await EpisodeService.createEpisode(req, res);
});

// Update an episode
/**
 * @swagger
 * /api/episode/{id}:
 *   put:
 *     summary: Update an episode
 *     tags: [Episode]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the episode to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               episodeNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Episode updated successfully
 *       404:
 *         description: Episode not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  await EpisodeService.updateEpisode(req, res);
});

// Delete an episode
/**
 * @swagger
 * /api/episode/{id}:
 *   delete:
 *     summary: Delete an episode
 *     tags: [Episode]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the episode to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Episode deleted successfully
 *       404:
 *         description: Episode not found
 *       500:
 *         description: Internal Server Error
 */
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  await EpisodeService.deleteEpisode(req, res);
});

export default router;