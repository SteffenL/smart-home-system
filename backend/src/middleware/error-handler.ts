import * as express from "express";
import * as httpErrors from "http-errors";

export default () => (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err) {
        if (httpErrors.isHttpError(err)) {
            const httpError = err as httpErrors.HttpError;
            const codeToViewMap: { [key: number]: string } = {
                401: "unauthorized",
                403: "forbidden"
            };
            const view = codeToViewMap[httpError.statusCode];
            if (view) {
                res.status(httpError.statusCode);
                res.render(`error/${view}`);
                return;
            }
        }
        console.error(err);
    }
    res.status(500);
    res.render("error/unexpected");
};
