"use strict";
/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get server status and system information
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
const status_1 = require("@services/status");
const Response_1 = require("@utils/Response");
const router = (0, express_1.Router)();
router.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const monitor = new status_1.ServerMonitor();
    try {
        const [systemStats, pingResult] = yield Promise.all([
            monitor.getSystemStats(),
            monitor.pingHost('api.varizz.xyz')
        ]);
        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0)
                return '0 Byte';
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
        };
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
                    usagePercent: Math.round(systemStats.memory.usagePercent * 100) / 100
                },
                disk: {
                    total: systemStats.disk.total,
                    used: systemStats.disk.used,
                    free: systemStats.disk.free,
                    usagePercent: Math.round(systemStats.disk.usagePercent * 100) / 100
                },
                network: systemStats.network,
                uptime: systemStats.uptime
            },
            connectivity: {
                isReachable: pingResult,
                pingDetails: pingResult ? 'Server is responding' : 'Server is not responding',
                lastChecked: new Date().toISOString()
            }
        };
        const humanReadableStats = Object.assign(Object.assign({}, response), { systemStats: Object.assign(Object.assign({}, response.systemStats), { memory: Object.assign(Object.assign({}, response.systemStats.memory), { totalReadable: formatBytes(response.systemStats.memory.total), usedReadable: formatBytes(response.systemStats.memory.used), freeReadable: formatBytes(response.systemStats.memory.free) }), disk: Object.assign(Object.assign({}, response.systemStats.disk), { totalReadable: formatBytes(response.systemStats.disk.total), usedReadable: formatBytes(response.systemStats.disk.used), freeReadable: formatBytes(response.systemStats.disk.free) }) }) });
        const responseOptions = {
            status: 200,
            meta: {
                status: 200,
                timestamp: new Date().toISOString()
            }
        };
        res.status(200).json(Response_1.Resp.success(humanReadableStats, "Server status fetched successfully", responseOptions));
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
        res.status(500).json(Response_1.Resp.error("Failed to fetch server status", errorOptions));
    }
    finally {
        monitor.cleanup();
    }
}));
exports.default = router;
