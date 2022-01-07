import * as express from "express";
import * as httpErrors from "http-errors";
import { User } from "@langnes/smart-home-system-shared/domain";

export const loadAuthentication = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req.session as any).user as User;
    if (user) {
        res.locals.user = user;
    }
    next();
};

export const requireAuthentication = () => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!res.locals.user) {
        return next(new httpErrors.Unauthorized());
    }
    next();
};
