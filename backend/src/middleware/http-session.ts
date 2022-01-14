import * as connectRedis from "connect-redis";
import * as expressSession from "express-session";
import { RedisClient } from "redis";
import { HttpServerConfig, SessionConfig } from "../config/types";

const RedisStore = connectRedis(expressSession);

export default (sessionConfig: SessionConfig, httpServerConfig: HttpServerConfig, redisClient: RedisClient) => {
    return expressSession({
        cookie: {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: "strict",
            secure: httpServerConfig.useSecureCookies
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
