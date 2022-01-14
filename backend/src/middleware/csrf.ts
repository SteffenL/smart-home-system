import * as csrf from "csurf";
import * as express from "express";

export default (useSecureCookies: boolean) => {
    const router = express.Router();
    router.use(csrf({
        cookie: {
            httpOnly: true,
            sameSite: "strict",
            secure: useSecureCookies
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
