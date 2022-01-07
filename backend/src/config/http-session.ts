import * as connectRedis from "connect-redis";
import * as expressSession from "express-session";
import redisClient from "./redis-client";
import { SessionConfig } from "./types";

const RedisStore = connectRedis(expressSession);

export default (config: SessionConfig) => {
    return expressSession({
        cookie: {
            httpOnly: true,
            maxAge: 86400000,
            sameSite: "strict",
            secure: process.env.NODE_ENV !== "development"
        },
        name: "_session",
        resave: false,
        rolling: true,
        saveUninitialized: false,
        secret: config.secret,
        // FIXME: Get rid of cast to "any": https://github.com/auth0/express-openid-connect/issues/234
        store: new RedisStore({ client: redisClient, prefix: `${config.namePrefix}:` }) as any
    });
};
