import { Device, Schedule } from "@langnes/smart-home-system-shared/domain";

export type SessionConfig = {
    namePrefix: string;
    secret: string;
};

export type HttpServerConfig = {
    hostname: string;
    port: number;
    useContentSecurityPolicy: boolean;
    useSecureCookies: boolean;
};

export type UserConfig = {
    username: string;
    password: string;
};

export type LocalLoginConfig = {
    users: UserConfig[];
};

export type NetworkLoginConfig = {
    trustedNetworks: string[];
};

export type LoginConfig = {
    local: LocalLoginConfig;
    network: NetworkLoginConfig;
};

export type AppData = {
    devices: Device[];
    schedules: Schedule[];
};

export type RedisConfig = {
    hostname: string;
    port: number;
};

export type AppConfig = {
    data: AppData;
    httpServer: HttpServerConfig;
    redis: RedisConfig;
    login: LoginConfig;
    session: SessionConfig;
    timeZone: string;
};
