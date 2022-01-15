export enum DeviceType {
    PLUG = "plug"
}

export type VendorSystemInfo = {
    sw_ver: string;
    hw_ver: string;
    model: string;
    deviceId: string;
    oemId: string;
    hwId: string;
    rssi: number;
    longitude_i: number;
    latitude_i: number;
    alias: string;
    status: string;
    mic_type: string;
    feature: string;
    mac: string;
    updating: number;
    led_off: number;
    relay_state: number;
    on_time: number;
    active_mode: string;
    icon_hash: string;
    dev_name: string;
    next_action: {
        type: number;
    }
    tid: string;
    err_code: number;
};

export type PlugDeviceState = {
    relayState: boolean;
}

export type Device = {
    type: DeviceType;
    id: string;
    name: string;
    address: string;
    vendor: {
        systemInfo: VendorSystemInfo;
    },
    state: PlugDeviceState
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
    when: string;
    timeZone?: string;
};

export type User = {
    username: string;
    passwordHash: string;
};
