import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {LoginRequest, LogoutRequest, RefreshRequest} from "@localful/common";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthGuard} from "./auth.guards";

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
    return await this.authService.login(loginRequest.email, loginRequest.password);
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

  @Get("/check")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async check() {
    return true;
  }

  /**
   * An endpoint where users can request email verification emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param res
   */
  @Get("/verify")
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async verifyAccountEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }
}
