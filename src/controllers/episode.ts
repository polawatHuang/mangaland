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
router.get("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  await EpisodeService.getAllEpisodes(req, res);
});

// Get episode by ID
/**
 * @swagger
 * /api/episode/{id}:
 *   get:
 *     summary: Get an episode by ID
 *     tags: [Episode]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the episode
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Episode retrieved successfully
 *       404:
 *         description: Episode not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  await EpisodeService.getEpisodeById(req, res);
});

// Create a new episode
/**
 * @swagger
 * /api/episode:
 *   post:
 *     summary: Create a new episode
 *     tags: [Episode]
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
router.post("/", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  await EpisodeService.createEpisode(req, res);
});

// Update an episode
/**
 * @swagger
 * /api/episode/{id}:
 *   put:
 *     summary: Update an episode
 *     tags: [Episode]
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
router.put("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  await EpisodeService.updateEpisode(req, res);
});

// Delete an episode
/**
 * @swagger
 * /api/episode/{id}:
 *   delete:
 *     summary: Delete an episode
 *     tags: [Episode]
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
router.delete("/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  await EpisodeService.deleteEpisode(req, res);
});

export default router;