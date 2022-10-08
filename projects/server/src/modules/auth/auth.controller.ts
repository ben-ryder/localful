import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {ZodValidationPipe} from "../../common/schemas/zod-validation.pipe";
import {LoginRequest} from "../../common/schemas/auth/request/login.auth.request";
import {RevokeRequest} from "../../common/schemas/auth/request/revoke.auth.request";
import {RefreshRequest} from "../../common/schemas/auth/request/refresh.auth.request";
import {AuthGuard} from "./auth.guard";


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

  @Post("/revoke")
  @HttpCode(HttpStatus.OK)
  async revoke(@Body(new ZodValidationPipe(RevokeRequest)) revokeRequest: RevokeRequest) {
    return await this.authService.revokeTokens(revokeRequest);
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
  @Post("/password-reset")
  async requestPasswordReset(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/password-reset
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Password resets have not been implemented yet"
    });
  }

  /**
   * An endpoint to check if the given password reset token is valid.
   * This is useful as it allows quick user feedback in case the token has expired etc.
   *
   * @param res
   */
  @Post("/password-reset/check")
  async checkPasswordResetToken(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/password-reset/check
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
  @Post("/password-reset/change")
  async requestPasswordChange(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/password-reset/change
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
  @Post("/verify")
  async requestVerificationEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }

  /**
   * An endpoint where users can check if their verification token is valid.
   *
   * @param res
   */
  @Post("/verify/check")
  async checkVerificationToken(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify/check
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
  @Post("/verify/submit")
  async verifyAccountEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify/submit
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }
}
