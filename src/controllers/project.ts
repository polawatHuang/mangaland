/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: API related to projects management
 */

import { Request, Response, Router } from "express";
import { authenticateToken } from "@middleware/auth";
import { ProjectService } from "@services/project";

const router: Router = Router();

/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Get all projects with pagination
 *     tags: [Projects]
 *     description: Fetch a paginated list of projects with related user, episodes, and tags.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Get Project data Successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     projects:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           title:
 *                             type: string
 *                             example: "Awesome Manga Project"
 *                           description:
 *                             type: string
 *                             example: "A cool manga project with great content."
 *                           projectType:
 *                             type: string
 *                             example: "Manga"
 *                           status:
 *                             type: string
 *                             example: "Ongoing"
 *                           coverImage:
 *                             type: string
 *                             format: uri
 *                             example: "https://example.com/cover.jpg"
 *                           viewsCount:
 *                             type: integer
 *                             example: 1500
 *                           episodeTotal:
 *                             type: integer
 *                             example: 25
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           user:
 *                             type: object
 *                             properties:
 *                               username:
 *                                 type: string
 *                                 example: "variz"
 *                           episodes:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 101
 *                                 episodeNumber:
 *                                   type: integer
 *                                   example: 1
 *                                 title:
 *                                   type: string
 *                                   example: "Episode 1"
 *                                 description:
 *                                   type: string
 *                                   example: "The beginning of an epic journey."
 *                                 viewsCount:
 *                                   type: integer
 *                                   example: 500
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                           projectTags:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 tagId:
 *                                   type: integer
 *                                   example: 5
 *                                 projectId:
 *                                   type: integer
 *                                   example: 1
 *                           _count:
 *                             type: object
 *                             properties:
 *                               views:
 *                                 type: integer
 *                                 example: 1500
 *                               favourites:
 *                                 type: integer
 *                                 example: 200
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         totalProjects:
 *                           type: integer
 *                           example: 50
 *                         perPage:
 *                           type: integer
 *                           example: 10
 *       404:
 *         description: No projects found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "No projects found"
 *       500:
 *         description: Failed to retrieve projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to get project data"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                       example: 500
 *                     error:
 *                       type: string
 *                       example: "Internal Server Error"
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get("/", async (req: Request, res: Response) => {
  await ProjectService.getAllProjects(req, res);
});

/**
 * @swagger
 * /api/project/{identifier}:
 *   get:
 *     summary: Get a single project by Slug or ID
 *     tags: [Projects]
 *     description: Fetch a project by its slug or id.
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         description: The ID or Slug of the project.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved project.
 *       400:
 *         description: Invalid parameter. ID or slug is required.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Failed to retrieve project due to server error.
 */
router.get("/:identifier", async (req: Request, res: Response) => {
  await ProjectService.getProjectsBySlugAndId(req, res);
});

/**
 * @swagger
 * /api/project:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     description: Create a new project with the given details.
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
 *               - type
 *               - status
 *               - coverImage
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My Awesome Project"
 *               description:
 *                 type: string
 *                 example: "This is a project description."
 *               type:
 *                 type: string
 *                 enum: [manga, manhwa, manhua, webtoon, other]
 *                 example: "manga"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: "active"
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/image.jpg"
 *               userId:
 *                 type: integer
 *                 example: 1
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               slug:
 *                 type: string
 *                 description: "Automatically generated if not provided (based on title)."
 *                 example: "my-awesome-project"
 *     responses:
 *       201:
 *         description: Project created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 101
 *                     title:
 *                       type: string
 *                       example: "My Awesome Project"
 *                     description:
 *                       type: string
 *                       example: "This is a project description."
 *                     type:
 *                       type: string
 *                       example: "manga"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     coverImage:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     slug:
 *                       type: string
 *                       example: "my-awesome-project"
 *                     userId:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: Missing or invalid required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Failed to create project.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  await ProjectService.createProject(req, res);
});

/**
 * @swagger
 * /api/project/{identifier}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     description: Update a project by its unique ID or slug.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         description: "Project ID (integer) or slug (string)"
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - type
 *               - status
 *               - coverImage
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Project Title"
 *               description:
 *                 type: string
 *                 example: "Updated description of the project."
 *               type:
 *                 type: string
 *                 enum: [manga, manhwa, manhua, webtoon, other]
 *                 example: "webtoon"
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *                 example: "active"
 *               coverImage:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/updated-image.jpg"
 *               userId:
 *                 type: integer
 *                 example: 2
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [4, 5, 6]
 *               slug:
 *                 type: string
 *                 description: "Automatically updated based on the new title if provided."
 *                 example: "updated-project-title"
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Project updated successfully"
 *       400:
 *         description: Invalid request (missing or incorrect parameters).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid project type"
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Project not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  await ProjectService.updateProject(req, res);
});

/**
 * @swagger
 * /api/project/{identifier}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     description: Delete a project by its unique ID or slug.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         description: "Project ID (integer) or slug (string)"
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Project deleted successfully"
 *       400:
 *         description: Invalid request (missing or incorrect parameters).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid project ID or slug"
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Project not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "An error occurred"
 */
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  await ProjectService.deleteProject(req, res);
});

export default router;