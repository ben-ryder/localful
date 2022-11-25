import {Injectable} from "@nestjs/common";

import {sign, verify} from "jsonwebtoken";
import {ConfigService} from "../config/config";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  Roles,
  TokenPair,
  UserDto
} from "@ben-ryder/lfb-common";
import {DataStoreService} from "../data-store/data-store.service";
import {v4 as createUUID} from "uuid";
import {SystemError} from "../errors/base/system.error";
import ms, { StringValue } from "ms";

/**
 * on login:
 *  - create gid
 *  - initialize cid and persist
 *  - generate access and refresh tokens
 * on requests:
 *  - validate access token
 *  - check for gid blacklist
 *  - check token cid matches persisted cid ??
 * on refresh:
 *  - validate refresh token
 *  - check for gid blacklist
 *  - increment persisted cid
 *  - generate new tokens
 * on logout:
 *  - blacklist gid
 */


@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private dataStoreService: DataStoreService,
  ) {}

  /**
   * Create a new token pair for the given user.
   *
   * @param userDto
   */
  async createNewTokenPair(userDto: UserDto): Promise<TokenPair> {
    const groupId = createUUID();
    const sequenceId = 1;

    // Generate the expiry of the refresh token here so I can set an initial expiry on the sid value stored.
    // This expiry is then updated as the token is refreshed.
    // todo: the expiry of the stored sid doesn't exactly match the refresh tokens expiry as set by jsonwebtoken.
    const expiry = ms(this.configService.config.auth.refreshToken.expiry as StringValue);

    await this.setTokenGroupSequenceId(groupId, sequenceId, expiry);
    return this.createTokenPair(userDto, groupId, sequenceId);
  }

  /**
   * Create a new token pair for the given user's token group.
   *
   * @param userDto
   * @param groupId
   */
  async getRefreshedTokenPair(userDto: UserDto, groupId: string): Promise<TokenPair> {
    const sequenceId = await this.getTokenGroupSequenceId(groupId);
    if (!sequenceId) {
      throw new SystemError({
        message: `Failed to find sid for token group '${groupId}' for user '${userDto.id}.'`
      });
    }

    // Update the expiry of the sequence id to match the newly generated refresh token.
    // todo: the expiry of the stored sid doesn't exactly match the refresh tokens expiry as set by jsonwebtoken.
    const expiry = ms(this.configService.config.auth.refreshToken.expiry as StringValue);
    await this.setTokenGroupSequenceId(groupId, sequenceId + 1, expiry);

    return this.createTokenPair(userDto, groupId, sequenceId + 1);
  }

  /**
   * Return a token pair for the given user, group and sequence ID.
   *
   * @param userDto
   * @param groupId
   * @param sequenceId
   * @private
   */
  private async createTokenPair(userDto: UserDto, groupId: string, sequenceId: number): Promise<TokenPair> {
    const basicPayload = {
      iss: this.configService.config.auth.issuer || "local-first-backend",
      aud: this.configService.config.auth.audience || "local-first-backend",
      sub: userDto.id,
      gid: groupId,
      sid: sequenceId,
    };

    const accessTokenPayload = {
      ...basicPayload,
      type: "accessToken",
      isVerified: userDto.isVerified,
      roles: [Roles.user]
    };
    const accessToken = sign(
      accessTokenPayload,
      this.configService.config.auth.accessToken.secret,
      { expiresIn: this.configService.config.auth.accessToken.expiry },
    );

    const refreshTokenPayload = {
      ...basicPayload,
      type: "refreshToken"
    };
    const refreshToken = sign(
      refreshTokenPayload,
      this.configService.config.auth.refreshToken.secret,
      { expiresIn: this.configService.config.auth.refreshToken.expiry },
    );

    return {
      accessToken,
      refreshToken
    };
  }

  /**
   * Validate the given access token. Return its payload if valid or null if not.
   * @param accessToken
   */
  async validateAndDecodeAccessToken(accessToken: string): Promise<AccessTokenPayload|null> {
    try {
      return verify(accessToken, this.configService.config.auth.accessToken.secret) as unknown as AccessTokenPayload;
    }
    catch (err) {
      // verify will throw an error if it fails
      return null;
    }
  }

  /**
   * Validate the given refresh token. Return its payload if valid or null if not.
   * @param refreshToken
   */
  async validateAndDecodeRefreshToken(refreshToken: string): Promise<RefreshTokenPayload|null> {
    try {
      return verify(refreshToken, this.configService.config.auth.refreshToken.secret) as unknown as RefreshTokenPayload;
    }
    catch (err) {
      // verify will throw an error if it fails
      return null;
    }
  }

  /**
   * Blacklist the given token group.
   *
   * @param groupId
   * @param expiry
   */
  async blacklistTokenGroup(groupId: string, expiry: number) {
    await this.dataStoreService.addItem(`bl-${groupId}`, "true", {
      epochExpiry: expiry
    });
  }

  /**
   * Determine if the given groupId has been blacklisted.
   *
   * @param groupId
   * @private
   */
  private async isTokenGroupBlacklisted(groupId: string): Promise<boolean> {
    return await this.dataStoreService.getItem(`bl-${groupId}`) !== null;
  }

  /**
   * Set the sequence ID for the given token group.
   *
   * @param groupId
   * @param sequenceId
   * @param expiry
   * @private
   */
  private async setTokenGroupSequenceId(groupId: string, sequenceId: number, expiry: number): Promise<void> {
    await this.dataStoreService.addItem(`sid-${groupId}`, sequenceId.toString(), {epochExpiry: expiry});
  }

  /**
   * Fetch the sequence ID for the supplied toke group.
   * Will return null if the sequence ID doesn't exist or is invalid.
   *
   * @param groupId
   * @private
   */
  private async getTokenGroupSequenceId(groupId: string): Promise<number|null> {
    const sequenceIdString = await this.dataStoreService.getItem(`sid-${groupId}`);
    if (!sequenceIdString) {
      return null;
    }

    try {
      return parseInt(sequenceIdString);
    }
    catch (e) {
      // todo: should do special handling if the data is invalid?
      return null;
    }
  }
}
