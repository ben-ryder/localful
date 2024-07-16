import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {LoginRequest, LogoutRequest, RefreshRequest} from "@localful/common";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {createAuthGuard} from "./auth.guards";

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
  @UseGuards(createAuthGuard())
  async check(@Response() res: ExpressResponse) {
    return res.status(HttpStatus.OK).send({
      statusCode: HttpStatus.OK,
      message: "Current user is authenticated"
    });
  }

  /**
   * An endpoint where users can request email verification emails.
   * Will always succeed regardless of if the email address supplied was valid and/or an email was actually sent
   *
   * @param res
   */
  @Get("/verify")
  @UseGuards(createAuthGuard())
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
  @UseGuards(createAuthGuard())
  async verifyAccountEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Account verification has not been implemented yet"
    });
  }
}
