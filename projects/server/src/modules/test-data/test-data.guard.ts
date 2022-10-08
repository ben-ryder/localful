import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import {Request} from "express";
import {ConfigService} from "../../services/config/config";


@Injectable()
export class TestDataGuard implements CanActivate {
  constructor(
    private configService: ConfigService
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest(req: Request) {
    if (!this.configService.config.testing.endpointEnabled) {
      return false;
    }

    const testingKey = req.header("testing-key");
    return testingKey === this.configService.config.testing.key;
  }
}
