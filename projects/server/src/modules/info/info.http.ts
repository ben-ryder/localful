import {ServerInfoDto} from "@localful/common";
import {ConfigService} from "@services/config/config.service.js";
import express, {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {Injectable} from "@common/injection/injectable-decorator.js";
import container from "@common/injection/container.js";


@Injectable()
export class InfoController {
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

const infoController = container.use(InfoController);

const InfoRouter = express.Router();
InfoRouter
    .get("/info", infoController.getInfo);

export default InfoRouter;
