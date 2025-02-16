"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.ServerMonitor = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const os = __importStar(require("os"));
const fs = __importStar(require("fs/promises"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class ServerMonitor {
    constructor() {
        this.lastNetworkStats = {};
        this.networkStatsInterval = null;
        this.updateNetworkStats();
        this.networkStatsInterval = setInterval(() => this.updateNetworkStats(), 1000);
    }
    updateNetworkStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stats = yield this.getNetworkStats();
                this.lastNetworkStats = stats;
            }
            catch (error) {
                console.error('Error updating network stats:', error);
            }
        });
    }
    getNetworkStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = {};
            try {
                const interfaces = yield fs.readdir('/sys/class/net/');
                for (const iface of interfaces) {
                    const rx = yield fs.readFile(`/sys/class/net/${iface}/statistics/rx_bytes`, 'utf-8');
                    const tx = yield fs.readFile(`/sys/class/net/${iface}/statistics/tx_bytes`, 'utf-8');
                    stats[iface] = {
                        rx_bytes: parseInt(rx),
                        tx_bytes: parseInt(tx)
                    };
                }
            }
            catch (error) {
                const osInterfaces = os.networkInterfaces();
                Object.entries(osInterfaces).forEach(([name, info]) => {
                    if (info) {
                        stats[name] = {
                            rx_bytes: 0,
                            tx_bytes: 0
                        };
                    }
                });
            }
            return stats;
        });
    }
    getCPUUsage() {
        return __awaiter(this, void 0, void 0, function* () {
            const start = os.cpus().map(cpu => cpu.times);
            yield new Promise(resolve => setTimeout(resolve, 100));
            const end = os.cpus().map(cpu => cpu.times);
            const idle = end.map((cpu, idx) => cpu.idle - start[idx].idle);
            const total = end.map((cpu, idx) => Object.values(cpu).reduce((a, b) => a + b, 0) -
                Object.values(start[idx]).reduce((a, b) => a + b, 0));
            const avgUsage = 100 * (1 - idle.reduce((a, b) => a + b) / total.reduce((a, b) => a + b));
            return Math.round(avgUsage * 100) / 100;
        });
    }
    getDiskUsage() {
        return __awaiter(this, arguments, void 0, function* (path = '/') {
            try {
                if (process.platform === 'win32') {
                    const driveLetter = path === '/' ? 'C:' : path;
                    const { stdout } = yield execAsync(`wmic logicaldisk where "DeviceID='${driveLetter}'" get size,freespace /value`);
                    const lines = stdout.trim().split('\n');
                    const values = {};
                    lines.forEach(line => {
                        const [key, value] = line.trim().split('=');
                        if (key && value) {
                            values[key.trim()] = value.trim();
                        }
                    });
                    const total = parseInt(values['Size'] || '0');
                    const free = parseInt(values['FreeSpace'] || '0');
                    const used = total - free;
                    return { total, used, free };
                }
                else {
                    const { stdout } = yield execAsync(`df -k ${path}`);
                    const lines = stdout.trim().split('\n');
                    const [, total, used, free] = lines[1].split(/\s+/);
                    return {
                        total: parseInt(total) * 1024,
                        used: parseInt(used) * 1024,
                        free: parseInt(free) * 1024
                    };
                }
            }
            catch (error) {
                try {
                    const drive = path === '/' ? os.platform() === 'win32' ? 'C:' : '/' : path;
                    const stats = yield fs.statfs(drive);
                    const total = stats.blocks * stats.bsize;
                    const free = stats.bfree * stats.bsize;
                    const used = total - free;
                    return { total, used, free };
                }
                catch (fallbackError) {
                    console.error('Failed to get disk usage:', fallbackError);
                    return {
                        total: 0,
                        used: 0,
                        free: 0
                    };
                }
            }
        });
    }
    getMemoryUsage() {
        const total = os.totalmem();
        const free = os.freemem();
        return {
            total,
            used: total - free,
            free
        };
    }
    getNetworkBandwidth() {
        let totalIncoming = 0;
        let totalOutgoing = 0;
        Object.values(this.lastNetworkStats).forEach(stats => {
            totalIncoming += stats.rx_bytes;
            totalOutgoing += stats.tx_bytes;
        });
        return {
            incoming: totalIncoming,
            outgoing: totalOutgoing,
            interfaces: this.lastNetworkStats
        };
    }
    getSystemStats() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [cpuUsage, memory, disk] = yield Promise.all([
                    this.getCPUUsage(),
                    this.getMemoryUsage(),
                    this.getDiskUsage()
                ]);
                const network = this.getNetworkBandwidth();
                const uptimeSeconds = os.uptime();
                return {
                    cpu: {
                        name: os.hostname(),
                        model: os.cpus()[0].model,
                        usage: cpuUsage,
                        cores: os.cpus().length,
                        load: os.loadavg()
                    },
                    memory: Object.assign(Object.assign({}, memory), { usagePercent: (memory.used / memory.total) * 100 }),
                    disk: Object.assign(Object.assign({}, disk), { usagePercent: disk.total > 0 ? (disk.used / disk.total) * 100 : 0 }),
                    network,
                    uptime: {
                        days: Math.floor(uptimeSeconds / 86400),
                        hours: Math.floor((uptimeSeconds % 86400) / 3600),
                        minutes: Math.floor((uptimeSeconds % 3600) / 60)
                    }
                };
            }
            catch (error) {
                console.error('Error getting system stats:', error);
                throw error;
            }
        });
    }
    pingHost(host) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield execAsync(`ping -c 1 ${host}`);
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    cleanup() {
        if (this.networkStatsInterval) {
            clearInterval(this.networkStatsInterval);
        }
    }
}
exports.ServerMonitor = ServerMonitor;
