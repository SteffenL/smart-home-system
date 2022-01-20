import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as helmet from "helmet";
import * as http from "http";
import * as path from "path";
import createRedisClient from "./config/redis-client";
import { loadAuthentication } from "./middleware/authentication";
import localsAppConfig from "./middleware/locals-app-config";
import errorHandler from "./middleware/error-handler";
import httpSession from "./middleware/http-session";
import loadAppConfig from "./config/app-config";
import routes from "./routes";
import { startJobs } from "./jobs";

const appConfig = loadAppConfig();
const frontendAssetsDir = path.resolve(path.join(path.dirname(__dirname), "node_modules", "@langnes/smart-home-system-frontend", "dist"));
const redisClient = createRedisClient(appConfig.redis);

const app = express();
app.set("trust proxy", ["loopback", "linklocal", "uniquelocal"]);

app.use(helmet({
    contentSecurityPolicy: appConfig.httpServer.useContentSecurityPolicy
}));
app.use("/", express.static(frontendAssetsDir));
app.use(cookieParser(appConfig.session.secret));
app.use(httpSession(appConfig.session, appConfig.httpServer, redisClient));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(localsAppConfig(appConfig));
app.use(loadAuthentication());
app.use(routes(appConfig));
app.use(errorHandler());

startJobs(appConfig);

http.createServer(app).listen(appConfig.httpServer.port);
