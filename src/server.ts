import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { config } from "@config/cors"
import { Resp } from "@utils/Response";
import passport from "@services/auth/authen";

import statusControllers from "@controllers/status";
import authenController from "@controllers/authen";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors(config.corsOptions));
app.use(passport.initialize());

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const errorOptions = {
    status: 500,
    meta: {
        status: 500,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
    }
  };

  res.status(500).json(Resp.error("Something broke!", errorOptions))
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json(Resp.success(null, "Hello World!", { status: 200, meta: { timestamp: new Date().toISOString() } }));
});

app.use('/api', statusControllers);
app.use('/api/auth' ,authenController);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});