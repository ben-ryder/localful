import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {LoginRequest, LogoutRequest, RefreshRequest} from "@ben-ryder/lfb-common";
import {AuthGuard} from "./auth.guards";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";


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
   * An empty endpoint which can be used to check if your auth credentials are valid.
   */
  @Get("/check")
  @UseGuards(AuthGuard)
  async check() {
    return null;
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
}
