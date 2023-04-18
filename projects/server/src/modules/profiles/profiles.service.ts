import {ProfilesDatabaseService} from "./database/profiles.database.service";
import {Injectable} from "@nestjs/common";
import {UserContext} from "../../common/request-context.decorator";
import {
    AccessControlScopes,
    ProfileCreateDto,
    ProfileDto,
    ProfileUpdateDto
} from "@ben-ryder/lfb-common";
import {AuthService} from "../../services/auth/auth.service";
import {ChangesService} from "../changes/changes.service";


@Injectable()
export class ProfilesService {
    constructor(
       private profilesDatabaseService: ProfilesDatabaseService,
       private changesService: ChangesService,
       private authService: AuthService
    ) {}

    async _get(userId: string) {
        return await this.profilesDatabaseService.get(userId);
    }

    async getWithAccessCheck(currentUserContext: UserContext, userId: string) {
        await this.authService.confirmAccessControlRules(
          [
            AccessControlScopes.PROFILES_RETRIEVE_SELF,
            AccessControlScopes.PROFILES_RETRIEVE,
          ],
          currentUserContext, userId
        );
        
        return this._get(userId);
    }

    async _create(profileCreateDto: ProfileCreateDto): Promise<ProfileDto> {
        return await this.profilesDatabaseService.create(profileCreateDto);
    }

    async createWithAccessCheck(currentUserContext: UserContext, profileCreateDto: ProfileCreateDto): Promise<ProfileDto> {
        await this.authService.confirmAccessControlRules(
          [
              AccessControlScopes.PROFILES_CREATE_SELF,
              AccessControlScopes.PROFILES_CREATE,
          ],
          currentUserContext, profileCreateDto.userId
        );
        
        return await this._create(profileCreateDto);
    }

    async _update(userId: string, profileUpdateDto: ProfileUpdateDto): Promise<ProfileDto> {
        return await this.profilesDatabaseService.update(userId, profileUpdateDto);
    }

    async updateWithAccessCheck(currentUserContext: UserContext, userId: string, profileUpdateDto: ProfileUpdateDto): Promise<ProfileDto> {
        await this.authService.confirmAccessControlRules(
          [
              AccessControlScopes.PROFILES_UPDATE_SELF,
              AccessControlScopes.PROFILES_UPDATE,
          ],
          currentUserContext, userId
        );
        
        return this._update(userId, profileUpdateDto);
    }

    async _delete(userId: string): Promise<void> {
        await this.profilesDatabaseService.delete(userId);

        // The user should be able to delete changes without required access checks in this specific
        // scenario, as this action is effectively deleting the users account and no content should remain.
        await this.changesService._deleteAll(userId);
    }

    async deleteWithAccessCheck(currentUserContext: UserContext, userId: string): Promise<void> {
        await this.authService.confirmAccessControlRules(
          [
              AccessControlScopes.PROFILES_DELETE_SELF,
              AccessControlScopes.PROFILES_DELETE,
          ],
          currentUserContext, userId
        );

        return this._delete(userId);
    }
}
