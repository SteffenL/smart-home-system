import { CronJob } from "cron";
import * as express from "express";
import { AppConfig } from "../../config/types";
import * as tplink from "../../integration/tplink";
import { ActionType, DeviceType, TimeUnitType } from "@langnes/smart-home-system-shared/domain";
import { TaskScheduler } from "../../task";

export default (appConfig: AppConfig) => {
    const scheduler = new TaskScheduler();

    scheduler.scheduleRecurring({
        async invoke() {
            appConfig.data.devices.forEach(async device => {
                const systemInfo = await tplink.getSysInfo(device);
                device.vendor.systemInfo = systemInfo;
                if (device.type === DeviceType.PLUG) {
                    device.state = {
                        relayState: !!systemInfo.relay_state
                    };
                }
            });
        }
    }, 10000, 0);

    function timeUnitToSeconds(unit: TimeUnitType): number {
        switch (unit) {
            case TimeUnitType.SECOND:
                return 1000;
            case TimeUnitType.MINUTE:
                return 60 * 1000;
            case TimeUnitType.HOUR:
                return 60 * 60 * 1000;
            case TimeUnitType.DAY:
                return 24 * 60 * 60 * 1000;
            case TimeUnitType.WEEK:
                return 7 * 24 * 60 * 60 * 1000;
        }
    }

    appConfig.data.schedules.forEach(schedule => {
        const timeZone = schedule.timeZone || appConfig.timeZone;
        const job = new CronJob(schedule.when, async () => {
            for (const action of schedule.actions) {
                switch (action.type) {
                    case ActionType.COMMAND: {
                        switch (action.command) {
                            case "on":
                            case "off": {
                                const newState = action.command === "on";
                                const device = appConfig.data.devices.find(x => x.id === action.device);
                                if (!device) {
                                    throw new Error(`Device not found: ${action.device}`);
                                }
                                await tplink.setRelayState(device, newState);
                                const systemInfo = await tplink.getSysInfo(device);
                                device.vendor.systemInfo = systemInfo;
                                device.state.relayState = !!systemInfo.relay_state;
                                break;
                            }
                        }
                        break;
                    }

                    case ActionType.DELAY: {
                        const delay = timeUnitToSeconds(action.unit) * action.value;
                        await new Promise(resolve => {
                            setTimeout(resolve, delay);
                        });
                        break;
                    }
                }
            }
        }, null, false, timeZone);
        job.start();
    });

    const router = express.Router();

    router.get("/", (req, res) => {
        res.render("dashboard", {
            devices: appConfig.data.devices,
            schedules: appConfig.data.schedules
        });
    });

    return router;
};
