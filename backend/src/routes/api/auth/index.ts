import * as express from "express";
import * as httpErrors from "http-errors";
import { Authentication } from "@langnes/smart-home-system-shared/api";
import { AppConfig } from "../../../config/types";
import loginRouter from "./login";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.use("/login", loginRouter(appConfig));

    router.post("/logout", (req, res, next) => {
        req.session.destroy(err => {
            res.clearCookie(appConfig.session.cookieName);
            if (err) {
                return next(err);
            }
            res.json(null);
        });
    });

    router.get("/current", (req, res) => {
        const user = (req.session as any).user;
        if (user) {
            const authentication: Authentication = {
                user: {
                    username: user.username
                }
            };
            res.json(authentication);
        } else {
            throw new httpErrors.Unauthorized();
        }
    });

    return router;
};
