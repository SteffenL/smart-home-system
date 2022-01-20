import * as express from "express";
import { AppConfig } from "../../config/types";
import * as dtoMapper from "../../mappers/dto";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.json(appConfig.data.devices.map(dtoMapper.fromDevice));
    });

    return router;
};
