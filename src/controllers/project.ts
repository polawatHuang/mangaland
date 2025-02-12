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
 *     summary: Get all projects
 *     tags: [Projects]
 *     description: Fetch all projects associated with the authenticated user.
 *     responses:
 *       200:
 *         description: Successfully retrieved projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to retrieve projects.
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: true,
        episodes: true,
        projectTags: true,
        views: true,
        favourites: true,
      },
    });

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
      Resp.success(projects, "Get Project data Successfully", {
        status: 200,
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
      Resp.error("Failed to get project data", errorOptions)
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
 *           type: integer
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

    if (!id || isNaN(Number(id))) {
      res.status(400).json(
        Resp.error("Invalid project ID", { 
          status: 400, 
          meta: { timestamp: new Date().toISOString() } 
        })
      );
      return;
    }

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
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
  const { title, description, type, status, coverImage, userId } = req.body;

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
  const { title, description, type, status, coverImage } = req.body;

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