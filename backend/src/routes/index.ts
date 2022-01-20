import * as express from "express";
import apiRoutes from "./api";
import { AppConfig } from "../config/types";
import csrf from "../middleware/csrf";

export default (appConfig: AppConfig) => {
    const router = express.Router();
    //router.use(csrf(appConfig.httpServer.useSecureCookies));
    router.use("/api", apiRoutes(appConfig));

    //router.use(publicRoutes(appConfig));
    //router.use(requireAuthentication());
    //router.use(csrf(appConfig.httpServer.useSecureCookies));
    //router.use(protectedRoutes(appConfig));
    return router;
};
