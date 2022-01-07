import * as express from "express";
import { AppConfig } from "../../config/types";
import authRoutes from  "./auth";
import supportRoutes from  "./support";

export default (appConfig: AppConfig) => {
    const router = express.Router();
    router.use("/auth", authRoutes(appConfig));
    router.use("/support", supportRoutes(appConfig));
    return router;
};
