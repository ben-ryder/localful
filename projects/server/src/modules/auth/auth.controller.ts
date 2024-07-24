import {Body, Controller, Get, HttpCode, HttpStatus, Post, Response, UseGuards} from "@nestjs/common";
import {Response as ExpressResponse} from "express";
import {AuthService} from "./auth.service";
import {CreateVaultDto, LoginRequest, LogoutRequest, RefreshRequest, VerifyEmailDto} from "@localful/common";
import {ZodValidationPipe} from "../../common/zod-validation.pipe";
import {AuthenticationGuard} from "./auth.guards";
import {RequestContext} from "../../common/request-context.decorator";

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
  @UseGuards(AuthenticationGuard)
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
   * @param context
   */
  @Get("/verify-email")
  @UseGuards(AuthenticationGuard)
  async requestEmailVerification(@RequestContext() context: RequestContext) {
    return this.authService.requestEmailVerification(context.user.id)
  }

  /**
   * An endpoint where users can verify their account
   *
   * @param context
   * @param verifyEmailDto
   */
  @Post("/verify-email")
  @UseGuards(AuthenticationGuard)
  async verifyEmail(
      @RequestContext() context: RequestContext,
      @Body(new ZodValidationPipe(CreateVaultDto)) verifyEmailDto: VerifyEmailDto,
  ) {
    return this.authService.verifyEmail(context.user, verifyEmailDto.token)
  }

  @Get("/change-email")
  @UseGuards(AuthenticationGuard)
  async requestEmailChange(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Email changing has not been implemented yet"
    });
  }

  @Post("/change-email")
  @UseGuards(AuthenticationGuard)
  async changeEmail(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Email changing has not been implemented yet"
    });
  }

  @Get("/password-reset")
  async requestPasswordReset(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Password reset has not been implemented yet"
    });
  }

  @Post("/password-reset")
  async resetPassword(@Response() res: ExpressResponse) {
    // todo: implement /v1/auth/verify [GET]
    return res.status(HttpStatus.NOT_IMPLEMENTED).send({
      statusCode: HttpStatus.NOT_IMPLEMENTED,
      message: "Password reset has not been implemented yet"
    });
  }
}
