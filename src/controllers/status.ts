/**
 * @swagger
 * tags:
 *   - name: Status
 *     description: API related to server status and system information
 */

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get server status and system information
 *     tags: [Status]
 *     description: Fetch detailed system stats, including CPU, memory, disk, network, and server connectivity status.
 *     responses:
 *       200:
 *         description: Successfully retrieved server status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 systemStats:
 *                   type: object
 *                   properties:
 *                     server:
 *                       type: string
 *                       description: The server status (e.g., "online")
 *                     cpu:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         model:
 *                           type: string
 *                         usage:
 *                           type: number
 *                           format: float
 *                         cores:
 *                           type: integer
 *                         load:
 *                           type: array
 *                           items:
 *                             type: number
 *                             format: float
 *                     memory:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         used:
 *                           type: integer
 *                         free:
 *                           type: integer
 *                         usagePercent:
 *                           type: number
 *                           format: float
 *                         totalReadable:
 *                           type: string
 *                         usedReadable:
 *                           type: string
 *                         freeReadable:
 *                           type: string
 *                     disk:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         used:
 *                           type: integer
 *                         free:
 *                           type: integer
 *                         usagePercent:
 *                           type: number
 *                           format: float
 *                         totalReadable:
 *                           type: string
 *                         usedReadable:
 *                           type: string
 *                         freeReadable:
 *                           type: string
 *                     network:
 *                       type: object
 *                       properties:
 *                         incoming:
 *                           type: integer
 *                         outgoing:
 *                           type: integer
 *                         interfaces:
 *                           type: object
 *                           additionalProperties:
 *                             type: object
 *                             properties:
 *                               rx_bytes:
 *                                 type: integer
 *                               tx_bytes:
 *                                 type: integer
 *                     uptime:
 *                       type: object
 *                       properties:
 *                         days:
 *                           type: integer
 *                         hours:
 *                           type: integer
 *                         minutes:
 *                           type: integer
 *                 connectivity:
 *                   type: object
 *                   properties:
 *                     isReachable:
 *                       type: boolean
 *                       description: Whether the server is reachable
 *                     pingDetails:
 *                       type: string
 *                       description: Ping test result
 *                     lastChecked:
 *                       type: string
 *                       format: date-time
 *       500:
 *         description: Failed to fetch server status.
 */

import { Request, Response, Router } from "express";
import { ServerMonitor } from "@services/status";
import { Resp, ResponseOptions } from "@utils/Response";
import { Format } from "@utils/format";
import logger from "@utils/logger";

interface CustomResponseOptions extends ResponseOptions {
    timestamp?: string;
    error?: string;
    meta?: {
        status: number;
        stack?: string;
        [key: string]: any;
    };
}

const router: Router = Router();

router.get('/status', async (req: Request, res: Response) => {
    const monitor = new ServerMonitor();
    
    try {
        const [systemStats, pingResult] = await Promise.all([
            monitor.getSystemStats().catch(err => {
                logger.error("Error fetching system stats", err);
                return null;
            }),
            monitor.pingHost('119.59.103.34').catch(err => {
                logger.error("Error pinging host", err);
                return false;
            })
        ]);

        if (!systemStats) {
            throw new Error("Failed to retrieve system stats");
        }

        const response = {
            systemStats: {
                server: "online",
                cpu: {
                    name: systemStats.cpu.name,
                    model: systemStats.cpu.model,
                    usage: Math.round(systemStats.cpu.usage * 100) / 100,
                    cores: systemStats.cpu.cores,
                    load: systemStats.cpu.load.map(load => Math.round(load * 100) / 100)
                },
                memory: {
                    total: systemStats.memory.total,
                    used: systemStats.memory.used,
                    free: systemStats.memory.free,
                    usagePercent: Math.round(systemStats.memory.usagePercent * 100) / 100,
                    totalReadable: Format.bytes(systemStats.memory.total),
                    usedReadable: Format.bytes(systemStats.memory.used),
                    freeReadable: Format.bytes(systemStats.memory.free)
                },
                disk: {
                    total: systemStats.disk.total,
                    used: systemStats.disk.used,
                    free: systemStats.disk.free,
                    usagePercent: Math.round(systemStats.disk.usagePercent * 100) / 100,
                    totalReadable: Format.bytes(systemStats.disk.total),
                    usedReadable: Format.bytes(systemStats.disk.used),
                    freeReadable: Format.bytes(systemStats.disk.free)
                },
                network: {
                    incoming: systemStats.network.incoming,
                    outgoing: systemStats.network.outgoing,
                    incomingReadable: Format.bytes(systemStats.network.incoming),
                    outgoingReadable: Format.bytes(systemStats.network.outgoing),
                    interfaces: systemStats.network.interfaces
                },
                uptime: systemStats.uptime
            },
            connectivity: {
                isReachable: pingResult,
                pingDetails: pingResult ? 'Server is responding' : 'Server is not responding',
                lastChecked: new Date().toISOString()
            },
            alerts: systemStats.alerts,
            heavyServices: systemStats.heavyServices
        };

        const responseOptions: CustomResponseOptions = {
            status: 200,
            meta: {
                status: 200,
                timestamp: new Date().toISOString()
            }
        };

        res.status(200).json(Resp.success(response, "Server status fetched successfully", responseOptions));
    } catch (error: any) {
        logger.error("Failed to fetch server status", error);

        const errorOptions: CustomResponseOptions = {
            status: 500,
            meta: {
                status: 500,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            }
        };

        res.status(500).json(Resp.error("Failed to fetch server status", errorOptions));
    } finally {
        monitor.cleanup();
    }
});

export default router;