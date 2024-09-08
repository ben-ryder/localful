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
import container from "@common/injection/container.js";


export async function createServer(): Promise<Server> {
  const app = express()
  const httpServer = http.createServer(app)

  // todo: add check for Postgres and Redis connection before starting the server.

  // Basic setup for request parsing
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

  // todo: define routes
  app.use(BaseController)
  app.use(InfoController)
  app.use(AuthController)
  app.use(UsersController)
  app.use(VaultsController)

  // todo: define websockets

  // 404 response handler
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.status(HttpStatusCodes.NOT_FOUND).send({
      identifier: ErrorIdentifiers.NOT_FOUND,
      statusCode: HttpStatusCodes.NOT_FOUND,
      message: "The route you requested could not be found.",
    })
  });

  app.use(httpErrorHandler)

  return httpServer
}
