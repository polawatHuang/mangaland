import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticateToken } from "@middleware/auth";
import { Resp } from "@utils/Response";

const prisma = new PrismaClient();
const router: Router = Router();

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