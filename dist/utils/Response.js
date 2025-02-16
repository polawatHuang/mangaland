"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resp = void 0;
const logger_1 = __importDefault(require("@utils/logger"));
class Resp {
    static success(result, message = "Success", options = {}) {
        const { status = 200, meta = null } = options;
        const response = {
            success: true,
            message,
            result,
            meta,
            status,
        };
        logger_1.default.info(message, { result, meta, status });
        return response;
    }
    static error(message = "An error occurred", options = {}) {
        const { status = 500, meta = null } = options;
        const response = {
            success: false,
            message,
            meta,
            status,
        };
        logger_1.default.error(message, { meta, status });
        return response;
    }
}
exports.Resp = Resp;
