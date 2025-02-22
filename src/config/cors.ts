export const config = {
    corsOptions: {
        // อนุญาตทุก origin ใน development และใช้ env variables ใน production
        origin: process.env.NODE_ENV === 'production'
            ? process.env.ALLOWED_ORIGINS?.split(',') || '*'
            : '*',

        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        maxAge: 86400,
        optionsSuccessStatus: 204,

        preflightContinue: false,
    }
};