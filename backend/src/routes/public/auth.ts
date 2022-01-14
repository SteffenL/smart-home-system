import * as crypto from "crypto";
import * as express from "express";
import { AppConfig } from "../../config/types";
import { checkNetworkTrust } from "../../middleware/check-network-trust";

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

    router.get("/login", (req, res) => {
        res.render("auth/login");
    });

    router.get("/login/network", (req, res) => {
        res.render("auth/network_login", {
            remoteAddress: req.ip
        });
    });

    router.post("/login/network", checkNetworkTrust(appConfig.login.network), (req, res) => {
        (req.session as any).user = {
            username: "network"
        };
        res.redirect("/");
    });

    router.get("/login/local", (req, res) => {
        res.render("auth/local_login", {
            failed: false,
            input: {}
        });
    });

    router.post("/login/local", (req, res) => {
        const user = appConfig.data.users.find(user => user.username === req.body.username);
        const pepper = appConfig.login.local.passwordPolicy.pepper;

        if (!user || !validatePassword(req.body.password, user.passwordHash, pepper)) {
            res.status(401);
            res.render("auth/local_login", {
                failed: true,
                input: req.body || {}
            });
            return;
        }

        (req.session as any).user = {
            username: user.username
        };
        res.redirect("/");
    });

    router.post("/logout", (req, res) => {
        req.session.destroy(() => {
            res.redirect("/");
        });
    });

    return router;
};
