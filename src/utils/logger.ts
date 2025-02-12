import dotenv from "dotenv";
import dayjs from "dayjs";
import { createLogger, format, transports, Logger } from "winston";
import axios from "axios";

dotenv.config();

class AppLogger {
    private static instance: AppLogger;
    private logger: Logger;
    private discordWebhookUrl: string | null;

    private constructor() {
        const isProduction = process.env.NODE_ENV === "production";

        this.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL as string;

        const currentDate = dayjs().format("YYYY-MM-DD");
        const logDirectory = "logs";
        
        this.logger = createLogger({
            level: isProduction ? "warn" : "debug", // ระดับ log ต่างกัน
            format: format.combine(
                format.timestamp({ format: () => dayjs().format("YYYY-MM-DD HH:mm:ss") }),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                    if (Object.keys(meta).length) {
                        log += ` | ${JSON.stringify(meta)}`;
                    }
                    return log;
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: `${logDirectory}/error-${currentDate}.log`, level: "error" }),
                new transports.File({ filename: `${logDirectory}/debug-${currentDate}.log`, level: "debug" }),
                new transports.File({ filename: `${logDirectory}/combined-${currentDate}.log` }),
            ],
        });
    }

    public static getInstance(): AppLogger {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }

    public info(message: string, meta: any = {}) {
        this.logger.info(message, meta);
        this.sendToDiscordLog("info", message, meta);
    }

    public warn(message: string, meta: any = {}) {
        this.logger.warn(message, meta);
        this.sendToDiscordLog("warn", message, meta);
    }

    public debug(message: string, meta: any = {}) {
        this.logger.debug(message, meta);
    }

    public async error(message: string, meta: any = {}) {
        this.logger.error(message, meta);

        if (this.discordWebhookUrl) {
            try {
                await this.sendToDiscordLog("error", message, meta);
            } catch (err) {
                this.logger.warn("Failed to send error notification to Discord", {
                    error: err,
                });
            }
        }
    }

    private async sendToDiscordLog(level: string, message: string, meta: any) {
        if (!this.discordWebhookUrl) return;
    
        const content = {
            embeds: [
                {
                    title: `🔔 Log Notification - ${level.toUpperCase()}`,
                    description: message,
                    color: level === "error" ? 15158332 : level === "warn" ? 16776960 : 3066993,
                    fields: [
                        {
                            name: "Meta",
                            value: meta && Object.keys(meta).length
                                ? `\`\`\`json\n${JSON.stringify(meta, null, 2)}\n\`\`\``
                                : "No additional information",
                        },
                    ],
                    timestamp: new Date().toISOString(),
                },
            ],
        };
    
        try {
            await axios.post(this.discordWebhookUrl, content, {
                headers: { "Content-Type": "application/json" },
            });
        } catch (err) {
            this.logger.warn("Failed to send log to Discord", { error: err });
        }
    }
}

export default AppLogger.getInstance();