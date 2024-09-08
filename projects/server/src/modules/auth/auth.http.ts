import express, {NextFunction, Request, Response} from "express"

import {LoginRequest, LogoutRequest, RefreshRequest, VerifyEmailDto} from "@localful/common";

import {RequestWithContext} from "@common/request-context.js";
import { validateSchema } from "@common/schema-validator.js";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {validateAuthentication} from "@modules/auth/validate-authentication.js";
import {AuthService} from "@modules/auth/auth.service.js";
import {Injectable} from "@common/injection/injectable-decorator.js";
import container from "@common/injection/container.js";


@Injectable()
export class AuthController {
  constructor(public authService: AuthService) {}

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
      await validateAuthentication(req);
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
      await validateAuthentication(req);
      await this.authService.requestEmailVerification(req.context.user.id)
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
      await validateAuthentication(req);
      const data = await validateSchema(req.body, VerifyEmailDto);
      await this.authService.verifyEmail(req.context.user, data.token)
      return res.sendStatus(HttpStatusCodes.OK)
    }
    catch (error) {
      next(error)
    }
  }

  async requestEmailChange(req: Request, res: Response, next: NextFunction) {
    try {
      await validateAuthentication(req);

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
      await validateAuthentication(req);

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
      await validateAuthentication(req);

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
      await validateAuthentication(req);

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

const authController = container.use(AuthController);

const AuthRouter = express.Router();
AuthRouter
    // Basic Auth
    .post("/v1/auth/login", authController.login.bind(authController))
    .post("/v1/auth/logout", authController.logout.bind(authController))
    .post("/v1/auth/refresh", authController.refresh.bind(authController))
    .post("/v1/auth/check", authController.check.bind(authController))
    // Email Verification
    .get("/v1/auth/verify-email", authController.requestEmailVerification.bind(authController))
    .post("/v1/auth/verify-email", authController.verifyEmail.bind(authController))
    // Change Email
    .get("/v1/auth/change-email", authController.requestEmailChange.bind(authController))
    .post("/v1/auth/change-email", authController.changeEmail.bind(authController))
    // Change Password
    .get("/v1/auth/change-password", authController.requestPasswordChange.bind(authController))
    .post("/v1/auth/change-password", authController.changePassword.bind(authController))

export default AuthRouter;
