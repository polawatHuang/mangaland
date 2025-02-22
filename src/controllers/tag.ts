/**
 * @swagger
 * tags:
 *   - name: Tag
 *     description: API related to Tag web application management
 */

import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "@middleware/auth";
import { Resp } from "@utils/Response";

const prisma = new PrismaClient();
const router: Router = Router();

/**
 * @swagger
 * /api/tag:
 *   get:
 *     summary: Get all tags
 *     description: Retrieve a list of tags with related project tags and count.
 *     tags: [Tag]
 *     responses:
 *       200:
 *         description: Successfully retrieved tags data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                           projectTags:
 *                             type: array
 *                             items:
 *                               type: object
 *                           _count:
 *                             type: object
 *                             properties:
 *                               projectTags:
 *                                 type: integer
 *       500:
 *         description: Failed to get tags data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: integer
 *                     meta:
 *                       type: object
 *                       properties:
 *                         error:
 *                           type: string
 *                         stack:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                           format: date-time
 */

router.get("/", async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        projectTags: true,
        _count: {
          select: {
            projectTags: true
          }
        }
      }
    })

    res.status(200).json(
      Resp.success(
        {
          tags
        },
        "Get Project data Successfully",
        { status: 200, meta: { timestamp: new Date().toISOString() } }
      )
    );
  } catch (error: any) {
    res.status(500).json(
      Resp.error("Failed to get tags data", {
        status: 500,
        meta: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
})

/**
 * @swagger
* /api/tag/{id}:
*   get:
*     summary: Get a tag by ID
*     description: Retrieve a specific tag by its ID.
*     tags: [Tag]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: The ID of the tag to retrieve
*     responses:
*       200:
*         description: Successfully retrieved tag data
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 success:
*                   type: boolean
*                 message:
*                   type: string
*                 data:
*                   type: object
*                   properties:
*                     tags:
*                       type: object
*                       properties:
*                         id:
*                           type: integer
*                         name:
*                           type: string
*                         createdAt:
*                           type: string
*                           format: date-time
*                         updatedAt:
*                           type: string
*                           format: date-time
*                         projectTags:
*                           type: array
*                           items:
*                             type: object
*                         _count:
*                           type: object
*                           properties:
*                             projectTags:
*                               type: integer
*       400:
*         description: Invalid tag ID
*       404:
*         description: Tag not found
*       500:
*         description: Failed to get tag data
*/

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params

  if (!id || isNaN(Number(id))) {
    res.status(400).json(
      Resp.error("Invalid tag ID", {
        status: 400,
        meta: { timestamp: new Date().toISOString() }
      })
    );
    return;
  }

  try {
    const tags = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        projectTags: true,
        _count: {
          select: {
            projectTags: true
          }
        }
      }
    })

    if (!tags) {
      res.status(404).json(
        Resp.error("Tag not found", {
          status: 404,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    res.status(200).json(
      Resp.success(
        {
          tags
        },
        "Get Project data Successfully",
        { status: 200, meta: { timestamp: new Date().toISOString() } }
      )
    );
  } catch (error: any) {
    res.status(500).json(
      Resp.error("Failed to get tag data", {
        status: 500,
        meta: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
})

/**
 * @swagger
* /api/tag:
*   post:
*     summary: Create a new tag
*     description: Add a new tag to the database.
*     tags: [Tag]
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: "New Tag"
*     responses:
*       201:
*         description: Successfully created tag
*       400:
*         description: Invalid tag name
*       500:
*         description: Failed to create tag
*/

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  const { name } = req.body

  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json(
        Resp.error("Invalid name, must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    const newTag = await prisma.tag.create({
      data: {
        name: name.trim(),
      }
    })

    res.status(201).json(
      Resp.success(newTag, "Tag created successfully", {
        status: 201,
        meta: { timestamp: new Date().toISOString() },
      })
    );
  } catch (error: any) {
    res.status(500).json(
      Resp.error("Failed to create tags data", {
        status: 500,
        meta: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
})

/**
* @swagger
* /tags/{id}:
*   put:
*     summary: Update an existing tag
*     description: Modify the name of an existing tag.
*     tags: [Tag]
*     security:
*       - BearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: The ID of the tag to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*                 example: "Updated Tag Name"
*     responses:
*       200:
*         description: Successfully updated tag
*       400:
*         description: Invalid tag ID or name
*       500:
*         description: Failed to update tag
*/

router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const { name } = req.body

  try {
    if (!id || isNaN(Number(id))) {
      res.status(400).json(
        Resp.error("Invalid tag ID", {
          status: 400,
          meta: { timestamp: new Date().toISOString() }
        })
      );
      return;
    }

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json(
        Resp.error("Invalid name, must be a non-empty string", {
          status: 400,
          meta: { timestamp: new Date().toISOString() },
        })
      );
      return;
    }

    await prisma.tag.update({
      where: { id: parseInt(id) },
      data: {
        name: name.trim(),
      }
    })

    res.status(200).json(
      Resp.success(null, "tag updated successfully", {
        status: 200,
        meta: { timestamp: new Date().toISOString() }
      })
    );
  } catch (error: any) {
    res.status(500).json(
      Resp.error("Failed to update tags data", {
        status: 500,
        meta: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }
})

export default router;