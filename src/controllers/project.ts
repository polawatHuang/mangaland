/**
 * @swagger
 * /api/project:
 *   get:
 *     summary: Get all projects
 *     description: Retrieve all projects.
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Get project data successfully, returns that data.
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

import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
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
router.get("/", async (req: Request, res: Response) => {
  try {
    res.status(200).json(Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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
    res.status(500).json(Resp.error("Failed to get project data", errorOptions)); 
  }
});

// Get a single project by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }
    res.status(200).json(Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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
    res.status(500).json(Resp.error("Failed to get project data", errorOptions)); 
  }
});

// Create a new project
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { title, description, type, status, coverImage, userId } = req.body;
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        type,
        status,
        coverImage,
        userId,
      },
    });
    res.status(201).json({ success: true, data: newProject });
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
    res.status(500).json(Resp.error("Failed to get project data", errorOptions));   
  }
});

// Update an existing project
router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    // const { id } = req.params;
    // const updatedProject = await prisma.project.update({
    //   where: { id: parseInt(id) },
    //   data: req.body,
    // });
    res.status(200).json(Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
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
    res.status(500).json(Resp.error("Failed to get project data by ID", errorOptions)); 
  }
});

// Delete a project
router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ success: true, message: "Project deleted successfully" });
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
    res.status(500).json(Resp.error("Failed to delete project", errorOptions)); 
  }
});

export default router;