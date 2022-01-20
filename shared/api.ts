export type CommandRequest = {
    id: string,
    command: string,
    [key: string]: any
}

export enum DeviceType {
    PLUG = "plug"
}

export type PlugDeviceState = {
    relayState: boolean;
}

export type DeviceState = PlugDeviceState;

export type Device = {
    type: DeviceType;
    id: string;
    name: string;
    address: string;
    state: DeviceState
};

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

export type Schedule = {
    actions: Action[];
    enabled: boolean;
    id: string;
    name: string;
    timeZone?: string;
    when: string;
};

export type User = {
    username: string;
};

export type Authentication = {
    user: User;
};

export class AuthenticationError extends Error { }
