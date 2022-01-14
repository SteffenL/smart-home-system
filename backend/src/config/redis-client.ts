import * as redis from "redis";
import { RedisConfig } from "./types";

export default (redisConfig: RedisConfig) => redis.createClient({
    host: redisConfig.hostname,
    port: redisConfig.port
});
