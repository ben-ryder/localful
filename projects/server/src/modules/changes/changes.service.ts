import {ChangesDatabaseService} from "./database/changes.database.service";
import {Injectable} from "@nestjs/common";
import {ChangeDto, AccessControlScopes} from "@ben-ryder/lfb-common";
import {UserContext} from "../../common/request-context.decorator";
import {AuthService} from "../../services/auth/auth.service";


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
      {
        scopes: [],
        combineBehaviour: "or"
      }
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
}
