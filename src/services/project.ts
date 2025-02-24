import { Request, Response } from "express";
import { PrismaClient, ProjectType } from "@prisma/client";
import { Resp } from "@utils/Response";

const prisma = new PrismaClient();

export class ProjectService {
    static async getAllProjects(req: Request, res: Response) {
        try {
            const { page = "1", limit = "10" } = req.query;
            const pageNum = parseInt(page as string, 10) || 1;
            const limitNum = parseInt(limit as string, 10) || 10;
            const skip = (pageNum - 1) * limitNum;

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
                    slug: true,
                    createdAt: true,
                    user: {
                        select: {
                            username: true,
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
                            episodes: true,
                        },
                    },
                },
            });

            const totalProjects = await prisma.project.count();
            const totalPages = Math.ceil(totalProjects / limitNum);
            const pagination = {
                currentPage: pageNum,
                totalPages,
                totalProjects,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1,
                nextPage: pageNum + 1,
                prevPage: pageNum - 1,
            }

            if (projects.length === 0) return res.status(404).json(Resp.error("Projects not found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

            return res.status(200).json(Resp.success({ projects, pagination }, "Projects retrieved successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        }
    };

    static async getProjectsBySlugAndId(req: Request, res: Response) {
        const { identifier } = req.params;

        if (!identifier) return res.status(400).json(Resp.error("Invalid parameter: ID or slug is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            const whereCondition = !isNaN(Number(identifier)) ? { id: parseInt(identifier) } : { slug: identifier };
            const project = await prisma.project.findFirst({
                where: whereCondition,
                select: {
                    id: true,
                    title: true,
                    description: true,
                    projectType: true,
                    status: true,
                    coverImage: true,
                    slug: true,
                    createdAt: true,
                    user: {
                        select: {
                            username: true,
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
                            episodes: true,
                        },
                    },
                },
            });

            if (!project) return res.status(404).json(Resp.error("Project not found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

            return res.status(200).json(Resp.success({ project }, "Project retrieved successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        }
    };

    static async createProject(req: Request, res: Response) {
        const { title, description, type, status, coverImage, userId, tagIds, slug } = req.body;

        // ตรวจสอบค่าที่จำเป็น
        if (![title, description, type, status, coverImage, userId, slug].every(Boolean)) {
            return res.status(400).json(Resp.error("Missing required fields", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        }

        // ตรวจสอบค่าประเภทต่างๆ
        if (typeof title !== "string" || !title.trim()) return res.status(400).json(Resp.error("Invalid title", { status: 400 }));
        if (typeof description !== "string" || !description.trim()) return res.status(400).json(Resp.error("Invalid description", { status: 400 }));
        if (typeof slug !== "string" || !slug.trim()) return res.status(400).json(Resp.error("Invalid slug", { status: 400 }));

        const validTypes = ["manga", "manhwa", "manhua", "webtoon", "other"];
        if (!validTypes.includes(type)) return res.status(400).json(Resp.error("Invalid project type", { status: 400 }));

        const validStatus = ["active", "inactive", "pending"];
        if (!validStatus.includes(status)) return res.status(400).json(Resp.error("Invalid project status", { status: 400 }));

        const coverImageRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
        if (!coverImageRegex.test(coverImage)) return res.status(400).json(Resp.error("Invalid coverImage URL format", { status: 400 }));

        if (isNaN(Number(userId))) return res.status(400).json(Resp.error("Invalid user ID", { status: 400 }));

        // ตรวจสอบ tagIds
        const parsedTagIds = Array.isArray(tagIds) ? tagIds.map(Number).filter(n => !isNaN(n)) : [];
        if (tagIds && parsedTagIds.length !== tagIds.length) {
            return res.status(400).json(Resp.error("Invalid tag IDs, must be an array of numbers", { status: 400 }));
        }

        // ตรวจสอบว่าผู้ใช้และแท็กมีอยู่จริง โดยใช้ Promise.all() เพื่อลดจำนวนการ Query ฐานข้อมูล
        const [userExists, existingTags] = await Promise.all([
            prisma.user.findUnique({ where: { id: parseInt(userId) } }),
            parsedTagIds.length ? prisma.tag.findMany({ where: { id: { in: parsedTagIds } } }) : []
        ]);

        if (!userExists) return res.status(400).json(Resp.error("User ID does not exist", { status: 400 }));

        const invalidTagIds = parsedTagIds.filter(tagId => !existingTags.some(tag => tag.id === tagId));
        if (invalidTagIds.length > 0) {
            return res.status(400).json(Resp.error(`Invalid tag IDs: ${invalidTagIds.join(", ")}`, { status: 400 }));
        }

        try {
            const newProject = await prisma.project.create({
                data: {
                    title,
                    description,
                    projectType: type as ProjectType,
                    status,
                    coverImage,
                    userId: parseInt(userId),
                    slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
                },
            });

            if (parsedTagIds.length) {
                await prisma.projectTag.createMany({
                    data: parsedTagIds.map(tagId => ({
                        tagId,
                        projectId: newProject.id
                    })),
                });
            }

            res.status(201).json(Resp.success(null, "Project created successfully", { status: 201, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        }
    }

    static async updateProject(req: Request, res: Response) {
        const { identifier } = req.params;
        const { title, description, type, status, coverImage, userId, tagIds, slug } = req.body;

        if (!identifier) return res.status(400).json(Resp.error("Invalid parameter: ID or slug is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        if (![title, description, type, status, coverImage, userId, slug].every(Boolean)) {
            return res.status(400).json(Resp.error("Missing required fields", { status: 400, meta: { timestamp: new Date().toISOString() } }));
        }

        if (typeof title !== "string" || !title.trim()) return res.status(400).json(Resp.error("Invalid title", { status: 400 }));
        if (typeof description !== "string" || !description.trim()) return res.status(400).json(Resp.error("Invalid description", { status: 400 }));
        if (typeof slug !== "string" || !slug.trim()) return res.status(400).json(Resp.error("Invalid slug", { status: 400 }));

        const validTypes = ["manga", "manhwa", "manhua", "webtoon", "other"];
        if (!validTypes.includes(type)) return res.status(400).json(Resp.error("Invalid project type", { status: 400 }));

        const validStatus = ["active", "inactive", "pending"];
        if (!validStatus.includes(status)) return res.status(400).json(Resp.error("Invalid project status", { status: 400 }));

        const coverImageRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
        if (!coverImageRegex.test(coverImage)) return res.status(400).json(Resp.error("Invalid coverImage URL format", { status: 400 }));

        if (isNaN(Number(userId))) return res.status(400).json(Resp.error("Invalid user ID", { status: 400 }));

        const parsedTagIds = Array.isArray(tagIds) ? tagIds.map(Number).filter(n => !isNaN(n)) : [];
        if (tagIds && parsedTagIds.length !== tagIds.length) return res.status(400).json(Resp.error("Invalid tag IDs, must be an array of numbers", { status: 400 }));

        const [userExists, existingTags] = await Promise.all([
            prisma.user.findUnique({ where: { id: parseInt(userId) } }),
            parsedTagIds.length ? prisma.tag.findMany({ where: { id: { in: parsedTagIds } } }) : []
        ]);

        if (!userExists) return res.status(400).json(Resp.error("User ID does not exist", { status: 400 }));

        const invalidTagIds = parsedTagIds.filter(tagId => !existingTags.some(tag => tag.id === tagId));
        if (invalidTagIds.length > 0) return res.status(400).json(Resp.error(`Invalid tag IDs: ${invalidTagIds.join(", ")}`, { status: 400 }));

        try {
            const whereCondition = !isNaN(Number(identifier)) ? { id: parseInt(identifier) } : { slug: identifier };
            const project = await prisma.project.findFirst({ where: whereCondition });

            if (!project) return res.status(404).json(Resp.error("Project not found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

            const updatedProject = await prisma.project.update({
                where: { id: project.id },
                data: {
                    title,
                    description,
                    projectType: type as ProjectType,
                    status,
                    coverImage,
                    userId: parseInt(userId),
                    slug: slug.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
                },
            });

            if (parsedTagIds.length) {
                await prisma.projectTag.deleteMany({ where: { projectId: updatedProject.id } });

                await prisma.projectTag.createMany({
                    data: parsedTagIds.map(tagId => ({
                        tagId,
                        projectId: updatedProject.id
                    })),
                });
            }

            res.status(200).json(Resp.success(null, "Project updated successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        }
    };

    static async deleteProject(req: Request, res: Response) {
        const { identifier } = req.params;

        if (!identifier) return res.status(400).json(Resp.error("Invalid parameter: ID or slug is required", { status: 400, meta: { timestamp: new Date().toISOString() } }));

        try {
            const whereCondition = !isNaN(Number(identifier)) ? { id: parseInt(identifier) } : { slug: identifier };
            const project = await prisma.project.findFirst({ where: whereCondition });

            if (!project) return res.status(404).json(Resp.error("Project not found", { status: 404, meta: { timestamp: new Date().toISOString() } }));

            await prisma.projectTag.deleteMany({ where: { projectId: project.id } });
            await prisma.project.delete({ where: { id: project.id } });

            res.status(200).json(Resp.success(null, "Project deleted successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
        } catch (error: any) {
            const errorOptions = {
                status: 500,
                meta: {
                    status: 500,
                    error: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            };
            res.status(500).json(Resp.error("An error occurred", errorOptions));
        }
    };
};