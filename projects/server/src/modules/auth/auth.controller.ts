import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {LoginRequest, LogoutRequest, RefreshRequest, Roles} from "@localful/common";
import {AuthGuard} from "./auth.guards";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {UseAccessControl} from "./access-control";


@Controller({
  path: "/auth",
  version: "1"
})
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post("/login")
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ZodValidationPipe(LoginRequest)) loginRequest: LoginRequest) {
    return await this.authService.login(loginRequest.username, loginRequest.password);
  }

  @Post("/logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body(new ZodValidationPipe(LogoutRequest)) logoutRequest: LogoutRequest
  ) {
    return await this.authService.logout(logoutRequest.refreshToken);
  }

  @Post("/refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(@Body(new ZodValidationPipe(RefreshRequest)) refreshRequest: RefreshRequest) {
    return await this.authService.refresh(refreshRequest.refreshToken);
  }

  /**
   * An endpoint where users can request password reset emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param res
   */
  @Get("/reset")
  async requestPasswordReset(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/reset [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Password resets have not been implemented yet"
    });
  }

  /**
   * An endpoint where users can request password reset emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param res
   */
  @Post("/reset")
  async requestPasswordChange(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/reset [POST]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Password resets have not been implemented yet"
    });
  }

  /**
   * An endpoint where users can request email verification emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param res
   */
  @Get("/verify")
  async requestVerificationEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }

  /**
   * An endpoint where users can verify their account
   *
   * @param res
   */
  @Post("/verify")
  async verifyAccountEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }

  /**
   * An endpoint which can be used to test if the use has a valid access token.
   */
  @Get("/check")
  @UseGuards(AuthGuard)
  async check() {
    return null;
  }

  /**
   * An endpoint which can be used to test if the user is verified.
   */
  @Get("/check/verified")
  @UseGuards(AuthGuard)
  @UseAccessControl({isVerified: true})
  async checkVerified() {
    return null;
  }

  /**
   * An endpoint which can be used to test if the user is verified.
   */
  @Get("/check/unverified")
  @UseGuards(AuthGuard)
  @UseAccessControl({isVerified: false})
  async checkUnverified() {
    return null;
  }

  /**
   * An endpoint which can be used to check if the user is admin.
   */
  @Get("/check/admin")
  @UseGuards(AuthGuard)
  @UseAccessControl({roles: [Roles.ADMIN]})
  async checkAdmin() {
    return null;
  }
}
