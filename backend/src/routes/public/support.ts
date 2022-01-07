import * as express from "express";
import { AppConfig } from "../../config/types";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("support/index");
    });

    return router;
};
