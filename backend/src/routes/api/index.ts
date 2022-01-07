import * as express from "express";
import * as httpErrors from "http-errors";
import { CommandRequestParams } from "@langnes/smart-home-system-shared/api";
import { AppConfig } from "../../config/types";
import * as tplink from "../../integration/tplink";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.get("/devices", async (req, res) => {
        res.json(appConfig.data.devices);
    });

    router.post("/command", async (req, res) => {
        const requestParams = req.body as CommandRequestParams;
        const device = appConfig.data.devices.find(device => device.id == requestParams.id);
        if (!device) {
            throw new httpErrors.NotFound("Device not found");
        }
        switch (requestParams.command) {
            case "on":
            case "off": {
                const newState = requestParams.command === "on";
                await tplink.setRelayState(device, newState);
                const systemInfo = await tplink.getSysInfo(device);
                device.vendor.systemInfo = systemInfo;
                device.state.relayState = !!systemInfo.relay_state;
                res.json(device);
                break;
            }
            default: {
                res.status(404);
                res.send();
                break;
            }
        }
    });

    return router;
};
