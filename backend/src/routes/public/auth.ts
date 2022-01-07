import * as express from "express";
import { AppConfig } from "../../config/types";
import { checkNetworkTrust } from "../../middleware/check-network-trust";

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
        const user = appConfig.login.local.users.find(user => user.username === req.body.username);

        if (!user || user.password !== req.body.password) {
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
