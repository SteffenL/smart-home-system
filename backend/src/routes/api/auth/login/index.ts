import * as express from "express";
import { AppConfig } from "../../../../config/types";
import localRouter from "./local";
import networkRouter from "./network";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.use("/local", localRouter(appConfig));
    router.use("/network", networkRouter(appConfig));

    return router;
};
