import * as express from "express";
import * as httpErrors from "http-errors";

export default () => (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err) {
        if (httpErrors.isHttpError(err)) {
            const httpError = err as httpErrors.HttpError;
            const codeToMessageMap: { [key: number]: string } = {
                401: "unauthorized",
                403: "forbidden"
            };
            const message = codeToMessageMap[httpError.statusCode];
            if (message) {
                res.status(httpError.statusCode);
                res.json({ error: { message: message }});
                return;
            }
        }
        console.error(err);
    }
    res.status(500);
    res.json(null);
};
