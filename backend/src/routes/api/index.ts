import * as express from "express";
import { AppConfig } from "../../config/types";
import { requireAuthentication } from "../../middleware/authentication";
import authRoutes from "./auth";
import deviceRoutes from "./device";
import commandRoutes from "./command";
import scheduleRoutes from "./schedule";

export default (appConfig: AppConfig) => {
    const router = express.Router();
    router.use("/auth", authRoutes(appConfig));
    router.use(requireAuthentication());
    router.use("/devices", deviceRoutes(appConfig));
    router.use("/command", commandRoutes(appConfig));
    router.use("/schedules", scheduleRoutes(appConfig));
    return router;
};
