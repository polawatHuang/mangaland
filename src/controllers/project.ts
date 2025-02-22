/**
 * @swagger
 * tags:
 *   - name: Projects
 *     description: API related to projects management
 */

import { Request, Response, Router } from "express";
import { PrismaClient, ProjectType, Status } from "@prisma/client";
import { authenticateToken } from "@middleware/auth";
import { Resp, ResponseOptions } from "@utils/Response";

const prisma = new PrismaClient();
const router: Router = Router();

interface CustomResponseOptions extends ResponseOptions {
  timestamp?: string;
  error?: string;
  meta?: {
    status: number;
    stack?: string;
    [key: string]: any;
  };
}

// Get all projects

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
  try {
    const { page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    // ดึงข้อมูลโปรเจคแบบแบ่งหน้า
    const projects = await prisma.project.findMany({
      take: limitNum,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        projectType: true,
        status: true,
        coverImage: true,
        viewsCount: true,
        episodeTotal: true,
        createdAt: true,
        user: {
          select: {
            username: true,
          },
        },
        episodes: {
          select: {
            id: true,
            episodeNumber: true,
            title: true,
            description: true,
            viewsCount: true,
            createdAt: true,
          },
        },
        projectTags: {
          select: {
            tagId: true,
            projectId: true,
          },
        },
        _count: {
          select: {
            views: true,
            favourites: true,
          },
        },
      },
    });

    // ดึงจำนวนโปรเจคทั้งหมด
    const totalProjects = await prisma.project.count();
    const totalPages = Math.ceil(totalProjects / limitNum);

    if (projects.length === 0) {
      res.status(404).json(
        Resp.error("No projects found", {
          status: 404,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    res.status(200).json(
      Resp.success(
        {
          projects,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalProjects,
            perPage: limitNum,
          },
        },
        "Get Project data Successfully",
        { status: 200, meta: { timestamp: new Date().toISOString() } }
      )
    );
  } catch (error: any) {
    res.status(500).json(
      Resp.error("Failed to get project data", {
        status: 500,
        meta: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
});

// Get a single project by ID

/**
 * @swagger
 * /api/project/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     tags: [Projects]
 *     description: Fetch a project by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           oneOf:
 *             - type: integer
 *             - type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved project.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Failed to retrieve project.
 */

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json(
        Resp.error("Invalid project ID or project Name", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    const project = await prisma.project.findFirst({
      where: {
        ...isNaN(parseInt(id))
          ? { title: id }
          : { id: parseInt(id) }
      },
      include: {
        user: true,
        episodes: true,
        projectTags: true,
        views: true,
        favourites: true,
      },
    });

    if (!project) {
      res.status(404).json(
        Resp.error("Project not found", {
          status: 404,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    res.status(200).json(
      Resp.success(project, "Get Project data Successfully", {
        status: 200,
        meta: { timestamp: new Date().toISOString() }
      })
    );
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
    res.status(500).json(
      Resp.error("Failed to get project data", errorOptions)
    );
  }
});

// Create a new project

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
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Project created successfully.
 *       500:
 *         description: Failed to create project.
 */

router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const { title, description, type, status, coverImage, userId, tagIds } = req.body;

  try {
    if (!title || !description || !type || !status || !coverImage || !userId) {
      res.status(400).json(
        Resp.error("Missing required fields", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (typeof title !== 'string' || title.trim() === '') {
      res.status(400).json(
        Resp.error("Invalid title, must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (typeof description !== 'string' || description.trim() === '') {
      res.status(400).json(
        Resp.error("Invalid description, must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const validTypes = ['manga', 'manhwa', 'manhua', 'webtoon', 'other'];
    if (!validTypes.includes(type)) {
      res.status(400).json(
        Resp.error("Invalid type, must be 'manga' or 'manhwa', 'manhua', 'webtoon', 'other'", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const validStatuses = ['active', 'inactive', 'pending'];
    if (!validStatuses.includes(status)) {
      res.status(400).json(
        Resp.error("Invalid status, must be 'active' or 'inactive', 'pending'", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const coverImageRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    if (!coverImageRegex.test(coverImage)) {
      res.status(400).json(
        Resp.error("Invalid coverImage URL format", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (!Array.isArray(tagIds)) {
      res.status(400).json(
        Resp.error("Invalid tagIds, must be an array", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (tagIds.some((tagId) => isNaN(Number(tagId)))) {
      res.status(400).json(
        Resp.error("Invalid tagIds, must be an array of numbers", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (isNaN(Number(userId))) {
      res.status(400).json(
        Resp.error("Invalid user ID, must be a number", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const userIdNumber = parseInt(userId);

    const userExists = await prisma.user.findUnique({
      where: { id: userIdNumber },
    });

    if (!userExists) {
      res.status(400).json(
        Resp.error("User ID does not exist", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (tagIds) {
      const existingTags = await prisma.tag.findMany({
        where: {
          id: {
            in: tagIds.map((tagId) => parseInt(tagId)),
          }
        }
      })

      const invalidTagIds = tagIds.filter(tagId => !existingTags.some(tag => tag.id === parseInt(tagId)));

      if (invalidTagIds.length > 0) {
        res.status(400).json(
          Resp.error(`Invalid tag IDs: ${invalidTagIds.join(', ')}`, {
            status: 400,
            meta: { timestamp: new Date().toISOString() },
          })
        );
        return;
      }
    }

    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        projectType: type as ProjectType,
        status,
        coverImage,
        userId: userIdNumber,
      },
    });

    // create project tags
    if (tagIds) {
      await prisma.projectTag.createMany({
        data: tagIds.map((tagId) => (
          {
            tagId: parseInt(tagId),
            projectId: newProject.id
          }
        )),
      });
    }

    res.status(201).json(
      Resp.success(newProject, "Project created successfully", {
        status: 201,
        meta: { timestamp: new Date().toISOString() },
      })
    );
  } catch (error: any) {
    const errorOptions: CustomResponseOptions = {
      status: 500,
      meta: {
        status: 500,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
    };
    res.status(500).json(
      Resp.error("Failed to create project", errorOptions)
    );
  }
});

// Update an existing project

/**
 * @swagger
 * /api/project/{id}:
 *   put:
 *     summary: Update an existing project
 *     tags: [Projects]
 *     description: Update a project by its unique ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *               type:
 *                 type: string
 *               status:
 *                 type: string
 *               coverImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully.
 *       500:
 *         description: Failed to update project.
 */

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, type, status, coverImage, tagIds } = req.body;

  try {
    if (!id || isNaN(Number(id))) {
      res.status(400).json(
        Resp.error("Invalid project ID", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json(
        Resp.error("Title is required and must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      res.status(400).json(
        Resp.error("Description is required and must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );

      return;
    }

    if (!type || typeof type !== "string" || type.trim() === "") {
      res.status(400).json(
        Resp.error("Type is required and must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!status || typeof status !== "string" || status.trim() === "") {
      res.status(400).json(
        Resp.error("Status is required and must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!coverImage || typeof coverImage !== "string" || coverImage.trim() === "") {
      res.status(400).json(
        Resp.error("Cover image URL is required and must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!Array.isArray(tagIds)) {
      res.status(400).json(
        Resp.error("Invalid tagIds, must be an array", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    if (tagIds.some((tagId) => isNaN(Number(tagId)))) {
      res.status(400).json(
        Resp.error("Invalid tagIds, must be an array of numbers", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const existingProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProject) {
      res.status(404).json(
        Resp.error("Project not found", {
          status: 404,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (tagIds) {
      const existingTags = await prisma.tag.findMany({
        where: {
          id: {
            in: tagIds.map((tagId) => parseInt(tagId)),
          }
        }
      })

      const invalidTagIds = tagIds.filter(tagId => !existingTags.some(tag => tag.id === parseInt(tagId)));

      if (invalidTagIds.length > 0) {
        res.status(400).json(
          Resp.error(`Invalid tag IDs: ${invalidTagIds.join(', ')}`, {
            status: 400,
            meta: { timestamp: new Date().toISOString() },
          })
        );
        return;
      }
    }

    await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        projectType: type as ProjectType,
        status: status as Status,
        coverImage,
      },
    });

    if (tagIds) {
      await prisma.projectTag.deleteMany({
        where: { projectId: parseInt(id) },
      })

      await prisma.projectTag.createMany({
        data: tagIds.map((tagId) => (
          {
            tagId: parseInt(tagId),
            projectId: parseInt(id)
          }
        )),
      });
    }

    res.status(200).json(
      Resp.success(null, "Project updated successfully", {
        status: 200,
        meta: { timestamp: new Date().toISOString() }
      })
    );

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

    res.status(500).json(
      Resp.error("Failed to update project", errorOptions)
    );
  }
});

// Delete a project

/**
 * @swagger
 * /api/project/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     description: Delete a project by its unique ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Project deleted successfully.
 *       400:
 *         description: Invalid project ID.
 *       500:
 *         description: Failed to delete project.
 */

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(Number(id))) {
      res.status(400).json(
        Resp.error("Invalid project ID", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    const parsedId = parseInt(id);

    const project = await prisma.project.findUnique({
      where: { id: parsedId },
      select: { id: true },
    });

    console.log(project)

    if (!project) {
      res.status(404).json(
        Resp.error("Project not found", {
          status: 404,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    await prisma.project.delete({
      where: { id: parsedId },
    });

    res.status(200).json(
      Resp.success(null, "Project deleted successfully", {
        status: 200,
        meta: { timestamp: new Date().toISOString() }
      })
    );
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

    res.status(500).json(
      Resp.error("Failed to delete project", errorOptions)
    );
  }
});

export default router;