"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("@middleware/auth");
const Response_1 = require("@utils/Response");
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
// Get all projects
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json(Response_1.Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to get project data", errorOptions));
    }
}));
// Get a single project by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const project = yield prisma.project.findUnique({
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
        res.status(200).json(Response_1.Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to get project data", errorOptions));
    }
}));
// Create a new project
router.post("/", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, type, status, coverImage, userId } = req.body;
        const newProject = yield prisma.project.create({
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
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to get project data", errorOptions));
    }
}));
// Update an existing project
router.put("/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { id } = req.params;
        // const updatedProject = await prisma.project.update({
        //   where: { id: parseInt(id) },
        //   data: req.body,
        // });
        res.status(200).json(Response_1.Resp.success(req.user, "Get Project data Successfully", { status: 200, meta: { timestamp: new Date().toISOString() } }));
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to get project data by ID", errorOptions));
    }
}));
// Delete a project
router.delete("/:id", auth_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.project.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    }
    catch (error) {
        const errorOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };
        res.status(500).json(Response_1.Resp.error("Failed to delete project", errorOptions));
    }
}));
exports.default = router;
