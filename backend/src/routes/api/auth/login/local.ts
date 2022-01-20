import * as crypto from "crypto";
import * as express from "express";
import * as httpErrors from "http-errors";
import { Authentication } from "@langnes/smart-home-system-shared/api";
import { AppConfig } from "../../../../config/types";

function validatePassword(password: string, passwordHash: string, pepper: string): boolean {
    const [iterationsString, algorithm, saltBase64, keyBase64] = passwordHash.split(":");
    const iterations = parseInt(iterationsString);

    const salt = Buffer.from(saltBase64, "base64");
    const key = Buffer.from(keyBase64, "base64");
    const keyLength = key.byteLength;

    const hmac = crypto.createHmac(algorithm, pepper);
    hmac.update(password);
    const hmacDigest = hmac.digest();

    const calculatedKey = crypto.pbkdf2Sync(hmacDigest, salt, iterations, keyLength, algorithm);
    const keysMatch = Buffer.compare(key, calculatedKey) === 0;

    return keysMatch;
}

export default (appConfig: AppConfig) => {
    const router = express.Router();

    router.post("/", (req, res) => {
        const user = appConfig.data.users.find(user => user.username === req.body.username);
        const pepper = appConfig.login.local.passwordPolicy.pepper;

        if (!user || !validatePassword(req.body.password, user.passwordHash, pepper)) {
            throw new httpErrors.Unauthorized();
        }

        (req.session as any).user = {
            username: user.username
        };

        const authentication: Authentication = {
            user: {
                username: user.username
            }
        };
        res.json(authentication);
    });

    return router;
};
