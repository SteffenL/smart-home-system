import { Device, Schedule, User } from "@langnes/smart-home-system-shared/domain";

export type SessionConfig = {
    namePrefix: string;
    secret: string;
    cookieName: string;
};

export type HttpServerConfig = {
    hostname: string;
    port: number;
    useContentSecurityPolicy: boolean;
    useSecureCookies: boolean;
};

export type PasswordPolicyConfig = {
    salt: string;
    iterations: number;
    algorithm: string;
    pepper: string;
};

export type LocalLoginConfig = {
    passwordPolicy: PasswordPolicyConfig
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
    users: User[];
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
