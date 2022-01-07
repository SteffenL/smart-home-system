import * as express from "express";
import * as ipaddr from "ipaddr.js";
import httpErrors = require("http-errors");
import { NetworkLoginConfig } from "../config/types";

export function checkIpInNetwork(address: string, networks: string[]) {
    const cidrs = networks.map(cidr => ipaddr.parseCIDR(cidr));
    const addressObject = ipaddr.process(address);
    const matchedCidr = cidrs.find(cidr => {
        if (addressObject.kind() === cidr[0].kind()) {
            const matches = addressObject.match(cidr);
            return matches;
        }
        return false;
    });
    return {
        matched: !!matchedCidr,
        network: matchedCidr
    };
}

export const checkNetworkTrust = (config: NetworkLoginConfig) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const trustResult = checkIpInNetwork(req.ip, config.trustedNetworks);

    if (!trustResult.matched) {
        console.warn(`Rejecting login request from non-trusted network (${req.ip}).`);
        return next(new httpErrors.Unauthorized());
    }

    console.debug(`Accepting login request from trusted network (${req.ip}).`);
    next();
};
