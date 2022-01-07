import * as fs from "fs";
import * as path from "path";
import { AppConfig } from "./types";

export default (configDir?: string): AppConfig => {
    configDir = configDir || process.env.CONFIG_DIR || path.resolve(".config");
    const configPath = path.join(configDir, "app.json");
    const configContent = fs.readFileSync(configPath, { encoding: "utf-8" });
    const appConfig = JSON.parse(configContent) as AppConfig;
    return appConfig;
};
