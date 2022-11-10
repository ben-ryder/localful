import {Injectable} from "@nestjs/common";
import {JSONData} from "@ben-ryder/lfb-common";
import {ProfilesDatabaseService} from "./database/profiles.database.service";
import {UserContext} from "../../common/request-context.decorator";
import {ConfigService} from "../../services/config/config";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";


@Injectable()
export class ProfilesService {
  constructor(
    private profilesDatabaseService: ProfilesDatabaseService,
    private configService: ConfigService
  ) {}

  controlAccess(userContext: UserContext, requestUserId: string) {
    // Always allow access if auth is not enabled.
    if (!this.configService.config.auth.jwksEndpoint) {
      return;
    }

    // Allow access only if the user is requesting their own data.
    if (userContext?.id === requestUserId) {
      return;
    }

    throw new AccessForbiddenError({});
  }

  async get(userContext: UserContext, userId: string) {
    this.controlAccess(userContext, userId);
    return this.profilesDatabaseService.get(userId);
  }

  async upsert(userContext: UserContext, userId: string, data: JSONData) {
    this.controlAccess(userContext, userId);
    return this.profilesDatabaseService.upsert(userId, data);
  }

  async delete(userContext: UserContext, userId: string) {
    this.controlAccess(userContext, userId);
    return this.profilesDatabaseService.delete(userId);
  }
}
