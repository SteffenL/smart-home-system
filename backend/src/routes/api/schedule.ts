import * as express from "express";
import { AppConfig } from "../../config/types";
import * as dtoMapper from "../../mappers/dto";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.get("/", async (req, res) => {
        res.json(appConfig.data.schedules.map(dtoMapper.fromSchedule));
    });

    router.get("/:id", async (req, res) => {
        const id = req.params.id;
        const schedule = appConfig.data.schedules.find(s => s.id === id);
        if (schedule) {
            res.json(dtoMapper.fromSchedule(schedule));
        } else {
            res.status(404);
            res.json(null);
        }
    });

    return router;
};
