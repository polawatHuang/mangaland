import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { config } from "@config/cors";
import { Resp } from "@utils/Response";
import passport from "@services/auth/authen";

import statusControllers from "@controllers/status";
import authenController from "@controllers/authen";
import projectController from "@controllers/project";
import settingController from "@controllers/setting";
import tagController from "@controllers/tag";
import advertiseController from "@controllers/ads";
import episodeController from "@controllers/episode";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Moodengmanga API",
      version: "1.0.0",
      description: "API documentation for the Moodengmanga project",
    },
  },
  apis: ["./src/controllers/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// กำหนด middleware สำหรับการอัปโหลดไฟล์
app.use(express.json());
app.use(express.urlencoded({ extended: true }));  // แก้ไขตรงนี้เพื่อให้สามารถรับ form-data ได้
app.use(cors(config.corsOptions));
app.use(passport.initialize());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const errorOptions = {
    status: 500,
    meta: {
      status: 500,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    },
  };
  res.status(500).json(Resp.error("Something broke!", errorOptions));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', statusControllers);
app.use('/api/auth', authenController);
app.use('/api/project', projectController);
app.use('/api/setting', settingController);
app.use('/api/tag', tagController);
app.use('/api/advertise', advertiseController);
app.use('/api/episode', episodeController);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});