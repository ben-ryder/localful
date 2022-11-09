import {ChangesDatabaseService} from "./database/changes.database.service";
import {Injectable} from "@nestjs/common";
import {ChangeDto} from "@ben-ryder/lfb-common";
import {UserContext} from "../../common/request-context.decorator";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {ConfigService} from "../../services/config/config";


@Injectable()
export class ChangesService {
  constructor(
    private changesDatabaseService: ChangesDatabaseService,
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

  async add(userContext: UserContext, userId: string, changes: ChangeDto[]) {
    return this.changesDatabaseService.add(userId, changes);
  }

  async list(userContext: UserContext, userId: string, ids?: string[]) {
    return this.changesDatabaseService.list(userId, ids);
  }

  async getIds(userContext: UserContext, userId: string) {
    return this.changesDatabaseService.getIds(userId);
  }
}
