import {NextFunction, Request, Response} from "express"

import {LoginRequest, LogoutRequest, RefreshRequest, VerifyEmailDto} from "@localful/common";

import {RequestWithContext} from "@common/request-context.js";
import { validateSchema } from "@common/schema-validator.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {AuthService} from "@modules/auth/auth.service.js";
import {AccessControlService} from "@modules/auth/access-control.service.js";


export class AuthHttpController {
  constructor(
      private readonly authService: AuthService,
      private readonly accessControlService: AccessControlService
  ) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await validateSchema(req.body, LoginRequest);
      const response = await this.authService.login(data.email, data.password);
      return res.status(HttpStatusCodes.OK).json(response);
    }
    catch (error) {
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await validateSchema(req.body, LogoutRequest);
      const response = await this.authService.logout(data.refreshToken);
      return res.status(HttpStatusCodes.OK).json(response);
    }
    catch (error) {
      next(error)
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await validateSchema(req.body, RefreshRequest);
      const response = await this.authService.refresh(data.refreshToken);
      return res.status(HttpStatusCodes.OK).json(response);
    }
    catch (error) {
      next(error)
    }
  }

  async check(req: Request, res: Response, next: NextFunction) {
    try {
      await this.accessControlService.validateAuthentication(req);
      return res.status(HttpStatusCodes.OK).send({
        statusCode: HttpStatusCodes.OK,
        message: "Current user is authenticated"
      });
    }
    catch(error) {
      next(error)
    }
  }

  /**
   * An endpoint where users can request email verification emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param req
   * @param res
   * @param next
   */
  async requestEmailVerification(req: RequestWithContext, res: Response, next: NextFunction) {
    try {
      const requestUser = await this.accessControlService.validateAuthentication(req);
      await this.authService.requestEmailVerification(requestUser.id)
      return res.sendStatus(HttpStatusCodes.OK)
    }
    catch (error) {
      next(error)
    }
  }

  /**
   * An endpoint where users can verify their account
   *
   * @param req
   * @param res
   * @param next
   */
  async verifyEmail(req: RequestWithContext, res: Response, next: NextFunction) {
    try {
      const requestUser = await this.accessControlService.validateAuthentication(req);
      const data = await validateSchema(req.body, VerifyEmailDto);
      const response = await this.authService.verifyEmail(requestUser, data.token)
      return res.status(HttpStatusCodes.OK).send(response)
    }
    catch (error) {
      next(error)
    }
  }

  async requestEmailChange(req: Request, res: Response, next: NextFunction) {
    try {
      await this.accessControlService.validateAuthentication(req);

      // todo: implement /v1/auth/verify [GET]
      return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
        statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
        message: "Email changing has not been implemented yet"
      });
    }
    catch (error) {
      next(error)
    }
  }

  async changeEmail(req: RequestWithContext, res: Response, next: NextFunction) {
    try {
      await this.accessControlService.validateAuthentication(req);

      // todo: implement /v1/auth/verify [GET]
      return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
        statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
        message: "Email changing has not been implemented yet"
      });
    }
    catch (error) {
      next(error)
    }
  }

  async requestPasswordChange(req: RequestWithContext, res: Response, next: NextFunction) {
    try {
      await this.accessControlService.validateAuthentication(req);

      // todo: implement /v1/auth/verify [GET]
      return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
        statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
        message: "Password reset has not been implemented yet"
      });
    }
    catch (error) {
      next(error)
    }
  }

  async changePassword(req: RequestWithContext, res: Response, next: NextFunction) {
    try {
      await this.accessControlService.validateAuthentication(req);

      // todo: implement /v1/auth/verify [GET]
      return res.status(HttpStatusCodes.NOT_IMPLEMENTED).send({
        statusCode: HttpStatusCodes.NOT_IMPLEMENTED,
        message: "Password reset has not been implemented yet"
      });
    }
    catch (error) {
      next(error)
    }
  }
}
