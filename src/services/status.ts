import { exec } from 'child_process';
import { promisify } from 'util';
import * as os from 'os';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

interface NetworkStats {
    rx_bytes: number;
    tx_bytes: number;
}

interface NetworkInterfaces {
    [key: string]: NetworkStats;
}

interface NetworkData {
    incoming: number;
    outgoing: number;
    interfaces: NetworkInterfaces;
}

interface SystemStats {
    cpu: {
        name: string;
        model: string;
        usage: number;
        cores: number;
        load: number[];
    };
    memory: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    disk: {
        total: number;
        used: number;
        free: number;
        usagePercent: number;
    };
    network: NetworkData;
    uptime: {
        days: number;
        hours: number;
        minutes: number;
    };
}

export class ServerMonitor {
    private lastNetworkStats: NetworkInterfaces = {};
    private networkStatsInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.updateNetworkStats();
        this.networkStatsInterval = setInterval(() => this.updateNetworkStats(), 1000);
    }

    private async updateNetworkStats(): Promise<void> {
        try {
            const stats = await this.getNetworkStats();
            this.lastNetworkStats = stats;
        } catch (error) {
            console.error('Error updating network stats:', error);
        }
    }

    private async getNetworkStats(): Promise<NetworkInterfaces> {
        const stats: NetworkInterfaces = {};
        try {
            const interfaces = await fs.readdir('/sys/class/net/');
            for (const iface of interfaces) {
                const rx = await fs.readFile(`/sys/class/net/${iface}/statistics/rx_bytes`, 'utf-8');
                const tx = await fs.readFile(`/sys/class/net/${iface}/statistics/tx_bytes`, 'utf-8');
                stats[iface] = {
                    rx_bytes: parseInt(rx),
                    tx_bytes: parseInt(tx)
                };
            }
        } catch (error) {
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
    }

    async getCPUUsage(): Promise<number> {
        const start = os.cpus().map(cpu => cpu.times);
        await new Promise(resolve => setTimeout(resolve, 100));
        const end = os.cpus().map(cpu => cpu.times);
        
        const idle = end.map((cpu, idx) => cpu.idle - start[idx].idle);
        const total = end.map((cpu, idx) => 
            Object.values(cpu).reduce((a, b) => a + b, 0) - 
            Object.values(start[idx]).reduce((a, b) => a + b, 0)
        );
        
        const avgUsage = 100 * (1 - idle.reduce((a, b) => a + b) / total.reduce((a, b) => a + b));
        return Math.round(avgUsage * 100) / 100;
    }

    async getDiskUsage(path: string = '/'): Promise<{ total: number; used: number; free: number }> {
        try {
            if (process.platform === 'win32') {
                const driveLetter = path === '/' ? 'C:' : path;
                const { stdout } = await execAsync(`wmic logicaldisk where "DeviceID='${driveLetter}'" get size,freespace /value`);
                
                const lines = stdout.trim().split('\n');
                const values: { [key: string]: string } = {};
                
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
            } else {
                const { stdout } = await execAsync(`df -k ${path}`);
                const lines = stdout.trim().split('\n');
                const [, total, used, free] = lines[1].split(/\s+/);
                
                return {
                    total: parseInt(total) * 1024,
                    used: parseInt(used) * 1024,
                    free: parseInt(free) * 1024
                };
            }
        } catch (error) {
            try {
                const drive = path === '/' ? os.platform() === 'win32' ? 'C:' : '/' : path;
                const stats = await fs.statfs(drive);
                
                const total = stats.blocks * stats.bsize;
                const free = stats.bfree * stats.bsize;
                const used = total - free;
                
                return { total, used, free };
            } catch (fallbackError) {
                console.error('Failed to get disk usage:', fallbackError);
                return {
                    total: 0,
                    used: 0,
                    free: 0
                };
            }
        }
    }

    getMemoryUsage(): { total: number; used: number; free: number } {
        const total = os.totalmem();
        const free = os.freemem();
        return {
            total,
            used: total - free,
            free
        };
    }

    getNetworkBandwidth(): NetworkData {
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

    async getSystemStats(): Promise<SystemStats> {
        try {
            const [cpuUsage, memory, disk] = await Promise.all([
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
                memory: {
                    ...memory,
                    usagePercent: (memory.used / memory.total) * 100
                },
                disk: {
                    ...disk,
                    usagePercent: disk.total > 0 ? (disk.used / disk.total) * 100 : 0
                },
                network,
                uptime: {
                    days: Math.floor(uptimeSeconds / 86400),
                    hours: Math.floor((uptimeSeconds % 86400) / 3600),
                    minutes: Math.floor((uptimeSeconds % 3600) / 60)
                }
            };
        } catch (error) {
            console.error('Error getting system stats:', error);
            throw error;
        }
    }

    async pingHost(host: string): Promise<boolean> {
        try {
            await execAsync(`ping -c 1 ${host}`);
            return true;
        } catch {
            return false;
        }
    }

    cleanup(): void {
        if (this.networkStatsInterval) {
            clearInterval(this.networkStatsInterval);
        }
    }
}