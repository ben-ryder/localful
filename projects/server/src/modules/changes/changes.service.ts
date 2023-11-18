import {ChangesDatabaseService} from "./database/changes.database.service";
import {Injectable} from "@nestjs/common";
import {ChangeDtoList, ChangesQueryParams} from "@localful/common";
import {UserContext} from "../../common/request-context.decorator";
import {AuthService} from "../auth/auth.service";


@Injectable()
export class ChangesService {
  constructor(
    private changesDatabaseService: ChangesDatabaseService,
    private authService: AuthService
  ) {}

  private async _UNSAFE_createMany(resourceId: string, changeDtoList: ChangeDtoList) {
    return this.changesDatabaseService.createMany(resourceId, changeDtoList);
  }

  async createMany(userContext: UserContext, resourceId: string, changeDtoList: ChangeDtoList){
    // todo: validate using resource service.
    await this.authService.validateAccessControlRules({
      userScopedPermissions: ["changes:create"],
      globalScopedPermissions: ["changes:create:all"],
      requestingUserContext: userContext,
      targetUserId: userContext.id
    })

    return this._UNSAFE_createMany(resourceId, changeDtoList);
  }

  async _UNSAFE_list(resourceId: string, params: ChangesQueryParams) {
    return this.changesDatabaseService.list(resourceId, params);
  }

  async list(userContext: UserContext, resourceId: string, params: ChangesQueryParams){
    // todo: validate using resource service.
    await this.authService.validateAccessControlRules({
      userScopedPermissions: ["changes:retrieve"],
      globalScopedPermissions: ["changes:retrieve:all"],
      requestingUserContext: userContext,
      targetUserId: userContext.id
    })

    return this._UNSAFE_list(resourceId, params);
  }
}
