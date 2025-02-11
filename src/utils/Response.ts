import logger from "@utils/logger";

export interface ResponseOptions {
    status?: number;
    meta?: any;
}

export class Resp {
    static success(result: any, message = "Success", options: ResponseOptions = {}) {
        const { status = 200, meta = null } = options;
        const response = {
            success: true,
            message,
            result,
            meta,
            status,
        };

        logger.info(message, { result, meta, status });
        return response;
    }

    static error(message = "An error occurred", options: ResponseOptions = {}) {
        const { status = 500, meta = null } = options;
        const response = {
            success: false,
            message,
            meta,
            status,
        };

        logger.error(message, { meta, status });
        return response;
    }
}