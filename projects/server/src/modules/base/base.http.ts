import express, {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {Injectable} from "@common/injection/injectable-decorator.js";
import container from "@common/injection/container.js";


@Injectable()
export class BaseController {
  async sendWelcomeMessage(req: Request, res: Response, next: NextFunction) {
    return res.status(HttpStatusCodes.OK).send({
      message: "Welcome to the Localful server. For docs see https://github.com/ben-ryder/localful."
    })
  }
}

const baseController = container.use(BaseController);

const BaseRouter = express.Router();
BaseRouter
    .get("/", baseController.sendWelcomeMessage)
    .get("/v1", baseController.sendWelcomeMessage)

export default BaseRouter;
