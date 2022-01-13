import * as connectRedis from "connect-redis";
import * as expressSession from "express-session";
import redisClient from "./redis-client";
import { AppConfig, SessionConfig } from "./types";

const RedisStore = connectRedis(expressSession);

export default (appConfig: AppConfig) => {
    const sessionConfig = appConfig.session;
    return expressSession({
        cookie: {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: "strict",
            secure: appConfig.httpServer.useSecureCookies
        },
        name: "_session",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: sessionConfig.secret,
        // FIXME: Get rid of cast to "any": https://github.com/auth0/express-openid-connect/issues/234
        store: new RedisStore({ client: redisClient, prefix: `${sessionConfig.namePrefix}:` }) as any
    });
};
