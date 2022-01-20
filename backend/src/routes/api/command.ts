import * as express from "express";
import * as httpErrors from "http-errors";
import { CommandRequest, Device } from "@langnes/smart-home-system-shared/api";
import { AppConfig } from "../../config/types";
import * as tplink from "../../integration/tplink";
import * as dtoMapper from "../../mappers/dto";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.post("/", async (req, res) => {
        const requestParams = req.body as CommandRequest;
        const device = appConfig.data.devices.find(device => device.id === requestParams.id);
        if (!device) {
            throw new httpErrors.NotFound("Device not found");
        }
        switch (requestParams.command) {
            case "on":
            case "off": {
                const newState = requestParams.command === "on";
                await tplink.setRelayState(device, newState);
                const systemInfo = await tplink.getSysInfo(device);
                //device.vendor.systemInfo = systemInfo;
                device.state.relayState = !!systemInfo.relay_state;
                res.json(dtoMapper.fromDevice(device));
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
