import {ServerInfoDto} from "@localful/common";
import {NextFunction, Request, Response} from "express";
import {HttpStatusCodes} from "@common/http-status-codes.js";
import {AccessControlService} from "@modules/auth/access-control.service.js";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {TokenService} from "@services/token/token.service.js";
import {AccessUnauthorizedError} from "@services/errors/access/access-unauthorized.error.js";
import * as crypto from "node:crypto";
import ms from "ms";


export class SyncHttpController {
  constructor(
      private readonly accessControlService: AccessControlService,
      private readonly dataStoreService: DataStoreService,
      private readonly tokenService: TokenService,
  ) {}

  async getConnectionTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.header("authorization");
      if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];
        if (accessToken) {
          const tokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

          // todo: validate access control permissions, verification status etc
          if (tokenPayload) {
            const ticketExpiry = new Date().getTime() + ms("10s");

            const connectionData = {
              userId: tokenPayload.sub,
              sessionId: tokenPayload.gid,
              // When the connection will expiry and require re-authentication
              sessionExpiry: tokenPayload.exp,
              // When the provided token will expire and no longer be usable to open a websocket connection
              ticketExpiry: ticketExpiry
            }
            const connectionTicket = crypto.randomBytes(16).toString("base64");

            await this.dataStoreService.addItem(connectionTicket, JSON.stringify(connectionData), {epochExpiry: ticketExpiry});

            return res.status(HttpStatusCodes.OK).json({ticket: connectionTicket});
          }
        }
      }

      next(new AccessUnauthorizedError({
        message: "You are not authorized to perform that action"
      }))
    }
    catch (error) {
      next(error);
    }
  }
}
