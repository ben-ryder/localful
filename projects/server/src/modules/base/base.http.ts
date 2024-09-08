import express, {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";


async function base(req: Request, res: Response, next: NextFunction) {
  return res.status(HttpStatusCodes.OK).send({
    message: "Welcome to the Localful server. For docs see https://github.com/ben-ryder/localful."
  })
}

const BaseRouter = express.Router();
BaseRouter
    .get("/", base)
    .get("/v1", base)

export default BaseRouter;
