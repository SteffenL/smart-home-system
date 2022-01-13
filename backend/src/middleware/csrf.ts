import * as csrf from "csurf";
import * as express from "express";
import { AppConfig } from "../config/types";

export default (appConfig: AppConfig) => {
    const router = express.Router();
    router.use(csrf({
        cookie: {
            httpOnly: true,
            sameSite: "strict",
            secure: appConfig.httpServer.useSecureCookies
        }
    }));
    router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (req.csrfToken) {
            res.locals.csrfToken = req.csrfToken();
        }
        next();
    });
    return router;
};
