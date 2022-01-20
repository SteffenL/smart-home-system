import { Authentication } from "@langnes/smart-home-system-shared/api";
import * as express from "express";
import { AppConfig } from "../../../../config/types";
import { checkNetworkTrust } from "../../../../middleware/check-network-trust";

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.post("/", checkNetworkTrust(appConfig.login.network), async (req, res) => {
        const username = "network";
        (req.session as any).user = {
            username
        };
        const authentication: Authentication = {
            user: {
                username
            }
        };
        res.json(authentication);
    });

    return router;
};
