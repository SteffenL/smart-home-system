import * as dto from "@langnes/smart-home-system-shared/api";
import * as domain from "@langnes/smart-home-system-shared/domain";

export function fromDevice(from: domain.Device): dto.Device {
    const { type, id, name, address, state } = from;
    return {
        type: fromDeviceType(type),
        id,
        name,
        address,
        state: fromDeviceState(type, state)
    };
}

export function toDevice(from: dto.Device): domain.Device {
    const { type, id, name, address, state } = from;
    return {
        type: toDeviceType(type),
        id,
        name,
        address,
        state: toDeviceState(type, state)
    };
}

export function fromDeviceType(from: domain.DeviceType): dto.DeviceType {
    switch (from) {
        case domain.DeviceType.PLUG:
            return dto.DeviceType.PLUG;
    }
}

export function toDeviceType(from: dto.DeviceType): domain.DeviceType {
    switch (from) {
        case dto.DeviceType.PLUG:
            return domain.DeviceType.PLUG;
    }
}

export function fromDeviceState(type: domain.DeviceType, from: domain.DeviceState): dto.DeviceState {
    switch (type) {
        case domain.DeviceType.PLUG:
            return {
                relayState: from.relayState
            };
    }
}

export function toDeviceState(type: dto.DeviceType, from: dto.DeviceState): domain.DeviceState {
    switch (type) {
        case dto.DeviceType.PLUG:
            return {
                relayState: from.relayState
            };
    }
}

/*

export enum ActionType {
    COMMAND = "command",
    DELAY = "delay"
}

export enum TimeUnitType {
    WEEK = "week",
    DAY = "day",
    HOUR = "hour",
    MINUTE = "minute",
    SECOND = "second"
}

export type CommandAction = {
    type: ActionType.COMMAND;
    device: string;
    command: string;
}

export type DelayAction = {
    type: ActionType.DELAY;
    value: number;
    unit: TimeUnitType;
}

export type Action = CommandAction | DelayAction;

*/

export function fromActionType(from: domain.ActionType): dto.ActionType {
    switch (from) {
        case domain.ActionType.COMMAND:
            return dto.ActionType.COMMAND;
        case domain.ActionType.DELAY:
            return dto.ActionType.DELAY;
    }
}

export function toActionType(from: dto.ActionType): domain.ActionType {
    switch (from) {
        case dto.ActionType.COMMAND:
            return domain.ActionType.COMMAND;
        case dto.ActionType.DELAY:
            return domain.ActionType.DELAY;
    }
}

export function fromTimeUnitType(from: domain.TimeUnitType): dto.TimeUnitType {
    switch (from) {
        case domain.TimeUnitType.WEEK:
            return dto.TimeUnitType.WEEK;
        case domain.TimeUnitType.DAY:
            return dto.TimeUnitType.DAY;
        case domain.TimeUnitType.HOUR:
            return dto.TimeUnitType.HOUR;
        case domain.TimeUnitType.MINUTE:
            return dto.TimeUnitType.MINUTE;
        case domain.TimeUnitType.SECOND:
            return dto.TimeUnitType.SECOND;
    }
}

export function toTimeUnitType(from: dto.TimeUnitType): domain.TimeUnitType {
    switch (from) {
        case dto.TimeUnitType.WEEK:
            return domain.TimeUnitType.WEEK;
        case dto.TimeUnitType.DAY:
            return domain.TimeUnitType.DAY;
        case dto.TimeUnitType.HOUR:
            return domain.TimeUnitType.HOUR;
        case dto.TimeUnitType.MINUTE:
            return domain.TimeUnitType.MINUTE;
        case dto.TimeUnitType.SECOND:
            return domain.TimeUnitType.SECOND;
    }
}

export function fromAction(from: domain.Action): dto.Action {
    const { type } = from;
    switch (type) {
        case domain.ActionType.COMMAND: {
            const { device, command } = from;
            return {
                type: dto.ActionType.COMMAND,
                device,
                command
            };
        }
        case domain.ActionType.DELAY: {
            const { value, unit } = from;
            return {
                type: dto.ActionType.DELAY,
                value,
                unit: fromTimeUnitType(unit)
            };
        }
    }
}

export function toAction(from: dto.Action): domain.Action {
    const { type } = from;
    switch (type) {
        case dto.ActionType.COMMAND: {
            const { device, command } = from;
            return {
                type: domain.ActionType.COMMAND,
                device,
                command
            };
        }
        case dto.ActionType.DELAY: {
            const { value, unit } = from;
            return {
                type: domain.ActionType.DELAY,
                value,
                unit: toTimeUnitType(unit)
            };
        }
    }
}

export function fromSchedule(from: domain.Schedule): dto.Schedule {
    const { actions, enabled, id, name, timeZone, when } = from;
    return {
        actions: actions.map(fromAction),
        enabled,
        id,
        name,
        timeZone,
        when
    };
}

export function toSchedule(from: dto.Schedule): domain.Schedule {
    const { actions, enabled, id, name, timeZone, when } = from;
    return {
        actions: actions.map(toAction),
        enabled,
        id,
        name,
        timeZone,
        when
    };
}
