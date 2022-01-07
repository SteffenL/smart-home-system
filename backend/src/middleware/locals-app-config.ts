import * as express from "express";
import { AppConfig } from "../config/types";

export default (appConfig: AppConfig) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.appConfig = appConfig;
    next();
};
