"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    corsOptions: {
        // รองรับหลาย domain และใช้ environmental variables
        origin: process.env.NODE_ENV === 'production'
            ? ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || ['https://your-production-domain.com']
            : ['http://localhost:3000', 'http://localhost:3001'],
        // ตั้งค่าความปลอดภัยเพิ่มเติม
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ระบุ HTTP methods ที่อนุญาต
        allowedHeaders: ['Content-Type', 'Authorization'], // ระบุ headers ที่อนุญาต
        exposedHeaders: ['Content-Range', 'X-Content-Range'], // headers ที่ต้องการให้ client เข้าถึงได้
        maxAge: 86400, // cache preflight requests เป็นเวลา 24 ชั่วโมง
        optionsSuccessStatus: 204, // ใช้ 204 แทน 200 สำหรับ preflight requests
        // ตรวจสอบ origin แบบละเอียด
        preflightContinue: false,
    }
};
