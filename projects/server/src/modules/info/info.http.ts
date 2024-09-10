import {ServerInfoDto} from "@localful/common";
import {ConfigService} from "@services/config/config.service.js";
import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";


export class InfoHttpController {
  constructor(private configService: ConfigService) {}

  async getInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const meta: ServerInfoDto = {
        version: "v1",
        registrationEnabled: this.configService.config.app.registrationEnabled,
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
}
