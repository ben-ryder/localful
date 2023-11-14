import {ChangesDatabaseService} from "./database/changes.database.service.js";
import {Injectable} from "@nestjs/common";
import {ChangeDto, AccessControlScopes} from "@localful/common";
import {UserContext} from "../../common/request-context.decorator.js";
import {AuthService} from "../../services/auth/auth.service.js";


@Injectable()
export class ChangesService {
  constructor(
    private changesDatabaseService: ChangesDatabaseService,
    private authService: AuthService
  ) {}

  async _create(userId: string, changes: ChangeDto[]) {
    return this.changesDatabaseService.add(userId, changes);
  }

  async createWithAccessCheck(userContext: UserContext, userId: string, changes: ChangeDto[]){
    await this.authService.confirmAccessControlRules(
      [
        AccessControlScopes.CHANGES_CREATE_SELF,
        AccessControlScopes.CHANGES_CREATE
      ],
      userContext, userId
    );

    return this._create(userId, changes);
  }

  async _list(userId: string, ids?: string[]) {
    return this.changesDatabaseService.list(userId, ids);
  }

  async listWithAccessCheck(userContext: UserContext, userId: string, ids?: string[]){
    await this.authService.confirmAccessControlRules(
      [
        AccessControlScopes.CHANGES_RETRIEVE_SELF,
        AccessControlScopes.CHANGES_RETRIEVE
      ],
      userContext, userId
    );

    return this._list(userId, ids);
  }

  async _getIds(userId: string) {
    return this.changesDatabaseService.getIds(userId);
  }

  async getIdsWithAccessCheck(userContext: UserContext, userId: string){
    await this.authService.confirmAccessControlRules(
      [
        AccessControlScopes.CHANGES_RETRIEVE_SELF,
        AccessControlScopes.CHANGES_RETRIEVE
      ],
      userContext, userId
    );

    return this._getIds(userId);
  }

  async _deleteAll(userId: string) {
    return await this.changesDatabaseService.deleteAll(userId);
  }

  async deleteAllWithAccessCheck(userContext: UserContext, userId: string){
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
