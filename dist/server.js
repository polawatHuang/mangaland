"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_2 = require("@config/cors");
const Response_1 = require("@utils/Response");
const authen_1 = __importDefault(require("@services/auth/authen"));
const status_1 = __importDefault(require("@controllers/status"));
const authen_2 = __importDefault(require("@controllers/authen"));
const project_1 = __importDefault(require("@controllers/project"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MangaLand API",
            version: "1.0.0",
            description: "API documentation for the MangaLand project",
        },
    },
    apis: ["./src/controllers/**/*.ts"],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(cors_2.config.corsOptions));
app.use(authen_1.default.initialize());
// Error handling
app.use((error, req, res, next) => {
    const errorOptions = {
        status: 500,
        meta: {
            status: 500,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        },
    };
    res.status(500).json(Response_1.Resp.error("Something broke!", errorOptions));
});
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
// Test route
app.get("/", (req, res) => {
    res.status(200).json(Response_1.Resp.success(null, "Hello World!", { status: 200, meta: { timestamp: new Date().toISOString() } }));
});
// Register routes
app.use('/api', status_1.default);
app.use('/api/auth', authen_2.default);
app.use('/api/project', project_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
