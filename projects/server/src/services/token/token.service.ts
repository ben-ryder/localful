import { Injectable } from "@nestjs/common";

import { JwtPayload, sign, verify } from "jsonwebtoken";
import { ConfigService } from "../config/config";
import {UserDto, TokenPair, AccessTokenPayload, RefreshTokenPayload} from "@ben-ryder/lfb-common";


@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
  ) {}

  /**
   * Create an access and refresh token for the given user.
   * @param user
   */
  createTokenPair(user: UserDto): TokenPair {
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: this.createRefreshToken(user),
    };
  }

  /**
   * Create an access token for the given user.
   * @param user
   */
  private createAccessToken(user: UserDto) {
    return sign(
      { type: "accessToken", userId: user.id, userIsVerified: user.isVerified },
      this.configService.config.auth.accessToken.secret,
      { expiresIn: this.configService.config.auth.accessToken.expiry },
    );
  }

  /**
   * Create a refresh token for the given user.
   * @param user
   */
  private createRefreshToken(user: UserDto) {
    return sign(
      {
        type: "refreshToken",
        userId: user.id,
        userIsVerified: user.isVerified,
      },
      this.configService.config.auth.refreshToken.secret,
      { expiresIn: this.configService.config.auth.refreshToken.expiry },
    );
  }

  /**
   * Validate the given token. Return it's payload if valid or null if not.
   * @param token
   * @param secret
   */
  private async validateAndDecodeToken<PayloadType>(
    token: string,
    secret: string,
  ) {
    let payload: PayloadType;

    try {
      payload = <PayloadType>verify(token, secret);
    }
    catch (err) {
      // verify will throw an error if it fails
      return null;
    }

    return payload;
  }

  /**
   * Validate the given access token. Return it's payload if valid or null if not.
   * @param token
   */
  async validateAndDecodeAccessToken(token: string) {
    return this.validateAndDecodeToken<AccessTokenPayload>(
      token,
      this.configService.config.auth.accessToken.secret,
    );
  }

  /**
   * Validate the given refresh token. Return it's payload if valid or null if not.
   * @param token
   */
  async validateAndDecodeRefreshToken(token: string) {
    return this.validateAndDecodeToken<RefreshTokenPayload>(
      token,
      this.configService.config.auth.refreshToken.secret,
    );
  }

  /**
   * Validate the supplied token.
   *
   * @param token
   * @param secret
   */
  private static async isValidToken(token: string, secret: string) {
    try {
      verify(token, secret);
    }
 catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Validate if the supplied token has been signed.
   * THIS IGNORES THE TOKEN EXPIRY.
   *
   * @param token
   * @param secret
   */
  private static async isSignedToken(token: string, secret: string) {
    try {
      verify(token, secret, { ignoreExpiration: true });
    }
 catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Validate the supplied access token.
   *
   * @param token
   */
  async isValidAccessToken(token: string) {
    return TokenService.isValidToken(
      token,
      this.configService.config.auth.accessToken.secret,
    );
  }

  /**
   * Validate if the given refresh token was signed by the token service at some point.
   *
   * @param token
   */
  async isValidRefreshToken(token: string) {
    return TokenService.isValidToken(
      token,
      this.configService.config.auth.refreshToken.secret,
    );
  }

  /**
   * Validate if the given access token was signed by the token service
   *
   * @param token
   */
  async isSignedAccessToken(token: string) {
    return TokenService.isSignedToken(
      token,
      this.configService.config.auth.accessToken.secret,
    );
  }

  /**
   * Validate if the given refresh token was signed by the token service
   *
   * @param token
   */
  async isSignedRefreshToken(token: string) {
    return TokenService.isSignedToken(
      token,
      this.configService.config.auth.refreshToken.secret,
    );
  }
}
