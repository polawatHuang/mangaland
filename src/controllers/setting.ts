/**
 * @swagger
 * tags:
 *   - name: Setting
 *     description: API related to Setting web application management
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

// Get all settings

/**
 * @swagger
 * /api/setting:
 *   get:
 *     summary: Get website settings
 *     tags: [Setting]
 *     description: Retrieve the settings of the website, including title, description, logo, and more.
 *     responses:
 *       200:
 *         description: Successfully retrieved website settings.
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
 *                   example: "Successfully retrieved website settings."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Manga Reader"
 *                     description:
 *                       type: string
 *                       example: "Manga Reader"
 *                     logo:
 *                       type: string
 *                       example: "/images/logo.png"
 *                     favicon:
 *                       type: string
 *                       example: "/images/favicon.ico"
 *                     timezone:
 *                       type: string
 *                       example: "UTC"
 *                     theme:
 *                       type: string
 *                       example: "light"
 *                     themeColors:
 *                       type: object
 *                       example: { "primary": "#FF5733", "secondary": "#333" }
 *                     navbar:
 *                       type: object
 *                       nullable: true
 *                       example: { "links": ["Home", "Manga", "About"] }
 *                     footer:
 *                       type: object
 *                       nullable: true
 *                       example: { "links": ["Contact", "Privacy Policy"] }
 *                     status:
 *                       type: string
 *                       enum: [online, offline]
 *                       example: "offline"
 *                     maintenanceTime:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: "2025-02-13T10:00:00Z"
 *                     countdown:
 *                       type: integer
 *                       nullable: true
 *                       example: 120
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T12:00:00Z"
 *       404:
 *         description: No settings found.
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
 *                   example: "No settings found"
 *       500:
 *         description: Failed to retrieve website settings.
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
 *                   example: "Failed to retrieve website settings."
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
 *                       example: "2025-02-13T12:00:00Z"
 */

router.get("/", async (req: Request, res: Response) => {
    try {
        const settings = await prisma.setting.findMany({ include: { menus: true } });

        if (settings.length === 0) {
            res.status(404).json(
                Resp.error("No settings found", {
                    status: 404,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        res.status(200).json(
            Resp.success(settings, "Get all settings successful!", { status: 200, meta: { timestamp: new Date().toISOString() } })
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
        res.status(500).json(Resp.error("Get all settings failed!", errorOptions));
    }
});

// Get setting by id

/**
 * @swagger
 * /api/setting/{id}:
 *   get:
 *     summary: Get website settings by ID
 *     tags: [Setting]
 *     description: Retrieve the settings of the website by ID, including title, description, logo, and more.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Setting ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved website settings by ID.
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
 *                   example: "Get setting by id successful!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Manga Reader"
 *                     description:
 *                       type: string
 *                       example: "Manga Reader"
 *                     logo:
 *                       type: string
 *                       example: "/images/logo.png"
 *                     favicon:
 *                       type: string
 *                       example: "/images/favicon.ico"
 *                     timezone:
 *                       type: string
 *                       example: "UTC"
 *                     theme:
 *                       type: string
 *                       example: "light"
 *                     themeColors:
 *                       type: object
 *                       example: { "primary": "#FF5733", "secondary": "#333" }
 *                     navbar:
 *                       type: object
 *                       nullable: true
 *                       example: { "links": ["Home", "Manga", "About"] }
 *                     footer:
 *                       type: object
 *                       nullable: true
 *                       example: { "links": ["Contact", "Privacy Policy"] }
 *                     status:
 *                       type: string
 *                       enum: [online, offline]
 *                       example: "offline"
 *                     maintenanceTime:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       example: "2025-02-13T10:00:00Z"
 *                     countdown:
 *                       type: integer
 *                       nullable: true
 *                       example: 120
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T12:00:00Z"
 *       404:
 *         description: Setting not found.
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
 *                   example: "Setting not found"
 *       500:
 *         description: Failed to retrieve website settings by ID.
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
 *                   example: "Get setting by id failed!"
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
 *                       example: "2025-02-13T12:00:00Z"
 */

router.get("/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        const setting = await prisma.setting.findUnique({ where: { id }, include: { menus: true } });

        if (!setting) {
            res.status(404).json(
                Resp.error("Setting not found", {
                    status: 404,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        res.status(200).json(
            Resp.success(setting, "Get setting by id successful!", { status: 200, meta: { timestamp: new Date().toISOString() } })
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
        res.status(500).json(Resp.error("Get setting by id failed!", errorOptions));
    }
});

// Create setting

/**
 * @swagger
 * /api/setting:
 *   post:
 *     summary: Create a new setting for the app
 *     tags: [Setting]
 *     description: Create a new setting with the given details.
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
 *                 example: Manga Reader
 *               description:
 *                 type: string
 *                 example: A simple manga reader app
 *               logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               favicon:
 *                 type: string
 *                 example: "https://example.com/favicon.ico"
 *               timezone:
 *                 type: string
 *                 example: "UTC"
 *               theme:
 *                 type: string
 *                 example: "light"
 *               themeColors:
 *                 type: object
 *                 example: {"primary": "#1890ff", "secondary": "#ff4d4f"}
 *               navbar:
 *                 type: object
 *                 example: {"items": [{"title": "Home", "link": "/home"}, {"title": "About", "link": "/about"}]}
 *               footer:
 *                 type: object
 *                 example: {"content": "© 2025 Manga Reader"}
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 example: "online"
 *               maintenanceTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-14T12:00:00Z"
 *               countdown:
 *                 type: integer
 *                 example: 3600
 *     responses:
 *       201:
 *         description: Setting created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Manga Reader
 *                 description:
 *                   type: string
 *                   example: A simple manga reader app
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */

router.post("/", authenticateToken, async (req: Request, res: Response) => {
    const { title, description, logo, favicon, timezone, theme, themeColors, navbar, footer, status, maintenanceTime, countdown } = req.body;

    try {
        if (!title || !description || !logo || !favicon || !timezone || !theme || !themeColors || !status) {
            res.status(400).json(
                Resp.error("Please provide all required fields!", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        if (typeof title !== 'string' || typeof description !== 'string' || typeof logo !== 'string' || typeof favicon !== 'string' || typeof timezone !== 'string' || typeof theme !== 'string') {
            res.status(400).json(
                Resp.error("Invalid data types for fields: title, description, logo, favicon, timezone, theme", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        try {
            if (typeof themeColors !== 'object' || Array.isArray(themeColors)) {
                JSON.parse(themeColors); // ตรวจสอบว่า themeColors เป็น JSON string ที่ valid หรือไม่
            }
        } catch (e) {
            res.status(400).json(
                Resp.error("Invalid themeColors format. It should be a valid JSON object.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const validStatuses = ['online', 'offline', 'maintenance'];
        if (!validStatuses.includes(status)) {
            res.status(400).json(
                Resp.error("Invalid status. Valid values are 'online', 'offline', or 'maintenance'.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        // ตรวจสอบว่า maintenanceTime ถ้ามีต้องเป็นรูปแบบ Date ที่ถูกต้อง
        if (maintenanceTime && isNaN(Date.parse(maintenanceTime))) {
            res.status(400).json(
                Resp.error("Invalid maintenanceTime format. It should be a valid ISO date string.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        // ตรวจสอบว่า countdown ถ้ามีต้องเป็นตัวเลขที่เป็นจำนวนเต็ม
        if (countdown && !Number.isInteger(countdown)) {
            res.status(400).json(
                Resp.error("Invalid countdown value. It should be an integer.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        try {
            if (navbar && (typeof navbar !== 'object' || Array.isArray(navbar))) {
                JSON.parse(navbar); // ตรวจสอบว่า navbar เป็น JSON string ที่ valid หรือไม่
            }
            if (footer && (typeof footer !== 'object' || Array.isArray(footer))) {
                JSON.parse(footer); // ตรวจสอบว่า footer เป็น JSON string ที่ valid หรือไม่
            }
        } catch (e) {
            res.status(400).json(
                Resp.error("Invalid navbar or footer format. They should be valid JSON objects.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const setting = await prisma.setting.create({
            data: {
                title,
                description,
                logo,
                favicon,
                timezone,
                theme,
                themeColors,
                navbar,
                footer,
                status,
                maintenanceTime,
                countdown,
            },
        });

        res.status(201).json(
            Resp.success(setting, "Setting created successfully!", { status: 201, meta: { timestamp: new Date().toISOString() } })
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
        res.status(500).json(Resp.error("Setting creation failed!", errorOptions));
    }
});

// Update setting

/**
 * @swagger
 * /api/setting/{id}:
 *   put:
 *     summary: Update the settings of the app
 *     tags: [Setting]
 *     description: Update a setting data.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the setting to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Manga Reader
 *               description:
 *                 type: string
 *                 example: A simple manga reader app
 *               logo:
 *                 type: string
 *                 example: "https://example.com/logo.png"
 *               favicon:
 *                 type: string
 *                 example: "https://example.com/favicon.ico"
 *               timezone:
 *                 type: string
 *                 example: "UTC"
 *               theme:
 *                 type: string
 *                 example: "light"
 *               themeColors:
 *                 type: object
 *                 example: {"primary": "#1890ff", "secondary": "#ff4d4f"}
 *               navbar:
 *                 type: object
 *                 example: {"items": [{"title": "Home", "link": "/home"}, {"title": "About", "link": "/about"}]}
 *               footer:
 *                 type: object
 *                 example: {"content": "© 2025 Manga Reader"}
 *               status:
 *                 type: string
 *                 enum: [online, offline, maintenance]
 *                 example: "online"
 *               maintenanceTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-14T12:00:00Z"
 *               countdown:
 *                 type: integer
 *                 example: 3600
 *     responses:
 *       200:
 *         description: Setting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Manga Reader
 *                 description:
 *                   type: string
 *                   example: A simple manga reader app
 *                 logo:
 *                   type: string
 *                   example: "https://example.com/logo.png"
 *                 favicon:
 *                   type: string
 *                   example: "https://example.com/favicon.ico"
 *                 timezone:
 *                   type: string
 *                   example: "UTC"
 *                 theme:
 *                   type: string
 *                   example: "light"
 *                 themeColors:
 *                   type: object
 *                   example: {"primary": "#1890ff", "secondary": "#ff4d4f"}
 *                 navbar:
 *                   type: object
 *                   example: {"items": [{"title": "Home", "link": "/home"}, {"title": "About", "link": "/about"}]}
 *                 footer:
 *                   type: object
 *                   example: {"content": "© 2025 Manga Reader"}
 *                 status:
 *                   type: string
 *                   example: "online"
 *                 maintenanceTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-14T12:00:00Z"
 *                 countdown:
 *                   type: integer
 *                   example: 3600
 *       400:
 *         description: Invalid request data or missing fields
 *       404:
 *         description: Setting with the given ID not found
 *       500:
 *         description: Internal server error
 */

router.put("/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { title, description, logo, favicon, timezone, theme, themeColors, navbar, footer, status, maintenanceTime, countdown } = req.body;

    try {
        if (!title || !description || !logo || !favicon || !timezone || !theme || !themeColors || !status) {
            res.status(400).json(
                Resp.error("Please provide all required fields!", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        if (typeof title !== 'string' || typeof description !== 'string' || typeof logo !== 'string' || typeof favicon !== 'string' || typeof timezone !== 'string' || typeof theme !== 'string') {
            res.status(400).json(
                Resp.error("Invalid data types for fields: title, description, logo, favicon, timezone, theme", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        try {
            if (typeof themeColors !== 'object' || Array.isArray(themeColors)) {
                JSON.parse(themeColors); // ตรวจสอบว่า themeColors เป็น JSON string ที่ valid หรือไม่
            }
        } catch (e) {
            res.status(400).json(
                Resp.error("Invalid themeColors format. It should be a valid JSON object.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const validStatuses = ['online', 'offline', 'maintenance'];
        if (!validStatuses.includes(status)) {
            res.status(400).json(
                Resp.error("Invalid status. Valid values are 'online', 'offline', or 'maintenance'.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        // ตรวจสอบว่า maintenanceTime ถ้ามีต้องเป็นรูปแบบ Date ที่ถูกต้อง
        if (maintenanceTime && isNaN(Date.parse(maintenanceTime))) {
            res.status(400).json(
                Resp.error("Invalid maintenanceTime format. It should be a valid ISO date string.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        // ตรวจสอบว่า countdown ถ้ามีต้องเป็นตัวเลขที่เป็นจำนวนเต็ม
        if (countdown && !Number.isInteger(countdown)) {
            res.status(400).json(
                Resp.error("Invalid countdown value. It should be an integer.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const updatedSetting = await prisma.setting.update({
            where: { id },
            data: {
                title,
                description,
                logo,
                favicon,
                timezone,
                theme,
                themeColors,
                navbar,
                footer,
                status,
                maintenanceTime: maintenanceTime ? new Date(maintenanceTime) : null,
                countdown: countdown || null,
            },
        });

        res.status(200).json(
            Resp.success(updatedSetting, "Setting updated successfully!", {
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
        res.status(500).json(Resp.error("Setting update failed!", errorOptions));
    }
});

// Delete setting

/**
 * @swagger
 * /api/setting/{id}:
 *   delete:
 *     summary: Delete a setting by ID
 *     tags: [Setting]
 *     description: Delete a setting by ID.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Setting ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Setting deleted successfully
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
 *                   example: "Setting deleted successfully!"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: Manga Reader
 *                     description:
 *                       type: string
 *                       example: A simple manga reader app
 *       400:
 *         description: Invalid setting ID
 *       500:
 *         description: Internal server error
 */

router.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        if (isNaN(id) || id <= 0) {
            res.status(400).json(
                Resp.error("Please provide a valid setting ID. It should be a positive integer.", {
                    status: 400,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const setting = await prisma.setting.findUnique({
            where: { id },
            select: { id: true },
        });

        if (!setting) {
            res.status(404).json(
                Resp.error(`Setting with ID ${id} not found.`, {
                    status: 404,
                    meta: { timestamp: new Date().toISOString() },
                })
            );
            return;
        }

        const deletedSetting = await prisma.setting.delete({
            where: { id },
        });

        res.status(200).json(
            Resp.success(deletedSetting, "Setting deleted successfully!", {
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

        // ตรวจสอบข้อผิดพลาดที่เกี่ยวกับ Prisma หรือฐานข้อมูล
        if (error.code === "P2003") {
            res.status(400).json(
                Resp.error("Cannot delete this setting due to a foreign key constraint violation.", errorOptions)
            );
            return;
        }

        // ตรวจสอบข้อผิดพลาดจาก Prisma ที่เกิดจากการใช้งานผิดปกติ
        if (error.code === "P2025") {
            res.status(404).json(
                Resp.error("Setting not found for deletion.", errorOptions)
            );
            return;
        }

        res.status(500).json(Resp.error("Setting deletion failed!", errorOptions));
    }
});

export default router;