import {ChangesDatabaseService} from "./database/changes.database.service.js";
import {Injectable} from "@nestjs/common";
import {ChangeDto, AccessControlScopes, ChangesQueryParams} from "@localful/common";
import {UserContext} from "../../common/request-context.decorator.js";
import {AuthService} from "../../services/auth/auth.service.js";


@Injectable()
export class ChangesService {
  constructor(
    private changesDatabaseService: ChangesDatabaseService,
    private authService: AuthService
  ) {}

  private async _UNSAFE_createMany(changes: ChangeDto[]) {
    return this.changesDatabaseService.createMany(changes);
  }

  async createMany(userContext: UserContext, changes: ChangeDto[]){
    // todo: do access check against every resource in the change list

    return this._UNSAFE_createMany(changes);
  }

  async _UNSAFE_list(userId: string, params?: ChangesQueryParams) {
    return this.changesDatabaseService.list(userId, ChangesQueryParams);
  }

  async list(userContext: UserContext, resourceId: string, params?: ChangesQueryParams){
    // todo: do access check

    return this._UNSAFE_list(resourceId, params);
  }

  async _UNSAFE_deleteAll(resourceId: string) {
    return await this.changesDatabaseService.deleteAll(resourceId);
  }

  async delete(userContext: UserContext, resourceId: string){
    await this.authService.confirmAccessControlRules(
      [
        AccessControlScopes.CHANGES_DELETE_SELF,
        AccessControlScopes.CHANGES_DELETE
      ],
      userContext, userId
    );

    return this._deleteAll(userId);
  }
}
