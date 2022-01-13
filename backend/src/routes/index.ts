import * as express from "express";
import apiRoutes from "./api";
import { AppConfig } from "../config/types";
import csrf from "../middleware/csrf";
import protectedRoutes from "./protected";
import publicRoutes from "./public";
import { requireAuthentication } from "../middleware/authentication";

export default (appConfig: AppConfig) => {
    const router = express.Router();
    router.use(publicRoutes(appConfig));
    router.use(requireAuthentication());
    router.use("/api", apiRoutes(appConfig));
    router.use(csrf(appConfig));
    router.use(protectedRoutes(appConfig));
    return router;
};
