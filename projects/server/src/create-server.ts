import express, {NextFunction, Request, Response} from "express";
import http, {Server} from "node:http";
import {httpErrorHandler} from "@services/errors/http-error-handler.js";
import cors from "cors";
import {createCorsOptions} from "@common/validate-cors.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {ErrorIdentifiers} from "@localful/common";

import BaseController from "@modules/base/base.http.js";
import InfoController from "@modules/info/info.http.js";
import AuthController from "@modules/auth/auth.http.js";
import UsersController from "@modules/users/users.http.js";
import VaultsController from "@modules/vaults/vaults.http.js";
import {ConfigService} from "@services/config/config.service.js";
import {container} from "@ben-ryder/injectable";
import {DatabaseService} from "@services/database/database.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";


export async function createServer(): Promise<Server> {
  // Start by running health checks for external services (Postgres and Redis).
  // This allows any connection errors to be immediately thrown rather than the server being able to start with problems.
  // todo: allow server to start and expose a /health endpoint protected by a static token for monitoring?
  const databaseService = container.use(DatabaseService)
  const dbIsHealth = await databaseService.healthCheck()
  if (!dbIsHealth) {
    console.error("Database service failed health check, likely a Postgres connection could not be established.")
    process.exit(1);
  }

  const dataStoreService = container.use(DataStoreService)
  const dataStoreIsHealthy = await dataStoreService.healthCheck()
  if (!dataStoreIsHealthy) {
    console.error("Data store service failed health check, likely a Redis connection could not be established.")
    process.exit(1);
  }
  console.debug("[Server] Health checks passed")

  // Basic Express and HTTP server setup
  const app = express()
  const httpServer = http.createServer(app)
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // Cors setup
  const configService = container.use(ConfigService);
  const corsOptions = createCorsOptions(configService)
  app.use(cors(corsOptions))
  app.options("*", cors(corsOptions))

  // GNU Terry Pratchett (http://www.gnuterrypratchett.com/)
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.set("X-Clacks-Overhead", "GNU Terry Pratchett");
    next();
  });

  // Load all route controllers
  app.use(BaseController)
  app.use(InfoController)
  app.use(AuthController)
  app.use(UsersController)
  app.use(VaultsController)

  // Setup error response handlers for 404 and server errors
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCodes.NOT_FOUND).send({
      identifier: ErrorIdentifiers.NOT_FOUND,
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: "The route you requested could not be found.",
    })
  });
  app.use(httpErrorHandler)

  // todo: setup websockets

  return httpServer
}
