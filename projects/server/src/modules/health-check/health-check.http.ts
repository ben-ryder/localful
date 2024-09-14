import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {HealthCheckService} from "@modules/health-check/health-check.service.js";

export class HealthCheckHttpController {
  constructor(
      private readonly healthCheckService: HealthCheckService
  ) {}

  async requestHealthCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.healthCheckService.runHealthCheck()
      res.status(HttpStatusCodes.OK).json(result);
    }
    catch (e) {
      next(e)
    }
  }
}
