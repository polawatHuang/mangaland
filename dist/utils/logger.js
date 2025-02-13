"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dayjs_1 = __importDefault(require("dayjs"));
const winston_1 = require("winston");
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
class AppLogger {
    constructor() {
        const isProduction = process.env.NODE_ENV === "production";
        this.discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || null;
        const currentDate = (0, dayjs_1.default)().format("YYYY-MM-DD");
        const logDirectory = "logs";
        this.logger = (0, winston_1.createLogger)({
            level: isProduction ? "warn" : "debug", // ระดับ log ต่างกัน
            format: winston_1.format.combine(winston_1.format.timestamp({ format: () => (0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss") }), winston_1.format.printf((_a) => {
                var { timestamp, level, message } = _a, meta = __rest(_a, ["timestamp", "level", "message"]);
                let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
                if (Object.keys(meta).length) {
                    log += ` | ${JSON.stringify(meta)}`;
                }
                return log;
            })),
            transports: [
                new winston_1.transports.Console(),
                new winston_1.transports.File({ filename: `${logDirectory}/error-${currentDate}.log`, level: "error" }),
                new winston_1.transports.File({ filename: `${logDirectory}/debug-${currentDate}.log`, level: "debug" }),
                new winston_1.transports.File({ filename: `${logDirectory}/combined-${currentDate}.log` }),
            ],
        });
    }
    static getInstance() {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }
    info(message, meta = {}) {
        this.logger.info(message, meta);
        this.sendToDiscordLog("info", message, meta);
    }
    warn(message, meta = {}) {
        this.logger.warn(message, meta);
        this.sendToDiscordLog("warn", message, meta);
    }
    debug(message, meta = {}) {
        this.logger.debug(message, meta);
    }
    error(message_1) {
        return __awaiter(this, arguments, void 0, function* (message, meta = {}) {
            this.logger.error(message, meta);
            if (this.discordWebhookUrl) {
                try {
                    yield this.sendToDiscordLog("error", message, meta);
                }
                catch (err) {
                    this.logger.warn("Failed to send error notification to Discord", {
                        error: err,
                    });
                }
            }
        });
    }
    sendToDiscordLog(level, message, meta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.discordWebhookUrl)
                return;
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
                yield axios_1.default.post(this.discordWebhookUrl, content, {
                    headers: { "Content-Type": "application/json" },
                });
            }
            catch (err) {
                this.logger.warn("Failed to send log to Discord", { error: err });
            }
        });
    }
}
exports.default = AppLogger.getInstance();
