import {ServerInfoDto} from "@localful/common";
import configService from "@services/config/config.service.js";
import express, {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";


async function getInfo(req: Request, res: Response, next: NextFunction) {
  try {
    const meta: ServerInfoDto = {
      version: "v1",
      registrationEnabled: configService.config.app.registrationEnabled,
      limits: {
        vaultsPerUser: 10,
        // todo: review if/how to implement these size limits.
        contentSize: 20,
        vaultSize: 1000,
      }
    }

    return res.status(HttpStatusCodes.OK).json(meta);
  }
  catch (error) {
    next(error);
  }
}

const InfoRouter = express.Router();
InfoRouter
    .get("/info", getInfo)

export default InfoRouter;
