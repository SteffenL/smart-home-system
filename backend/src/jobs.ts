import { ActionType, Device, DeviceType, Schedule, TimeUnitType } from "@langnes/smart-home-system-shared/domain";
import { TaskScheduler } from "@langnes/smart-home-system-shared/task";
import { CronJob } from "cron";
import { AppConfig } from "./config/types";
import * as tplink from "./integration/tplink";

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

function startDeviceScheduleJobs(devices: Device[], schedules: Schedule[], globalTimeZone: string) {
    schedules.filter(schedule => schedule.enabled).forEach(schedule => {
        const timeZone = schedule.timeZone || globalTimeZone;
        const job = new CronJob(schedule.when, async () => {
            for (const action of schedule.actions) {
                switch (action.type) {
                    case ActionType.COMMAND: {
                        switch (action.command) {
                            case "on":
                            case "off": {
                                const newState = action.command === "on";
                                const device = devices.find(x => x.id === action.device);
                                if (!device) {
                                    throw new Error(`Device not found: ${action.device}`);
                                }
                                await tplink.setRelayState(device, newState);
                                const systemInfo = await tplink.getSysInfo(device);
                                //device.vendor.systemInfo = systemInfo;
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
}

function startFetchDevicesJob(scheduler: TaskScheduler, device: Device[]) {
    scheduler.scheduleRecurring({
        async invoke() {
            device.forEach(async device => {
                const systemInfo = await tplink.getSysInfo(device);
                //device.vendor.systemInfo = systemInfo;
                if (device.type === DeviceType.PLUG) {
                    device.state = {
                        relayState: !!systemInfo.relay_state
                    };
                }
            });
        }
    }, 10000, 0);

}

export function startJobs(appConfig: AppConfig) {
    const scheduler = new TaskScheduler();
    startFetchDevicesJob(scheduler, appConfig.data.devices);
    startDeviceScheduleJobs(appConfig.data.devices, appConfig.data.schedules, appConfig.timeZone);
}
