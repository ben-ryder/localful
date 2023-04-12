import {ProfilesDatabaseService} from "./database/profiles.database.service";
import {Injectable} from "@nestjs/common";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {UserContext} from "../../common/request-context.decorator";
import {CreateProfileRequest, GetProfileResponse, ProfileDto, UpdateProfileRequest} from "@ben-ryder/lfb-common";


@Injectable()
export class ProfilesService {
    constructor(
       private profilesDatabaseService: ProfilesDatabaseService
    ) {}

    private _checkAccess(userContext: UserContext, userId: string): void {
        if (userContext?.id !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to profile"
            })
        }
    }

    async get(userId: string): Promise<GetProfileResponse> {
        return await this.profilesDatabaseService.get(userId);
    }

    async getWithAccessCheck(userContext: UserContext, userId: string): Promise<GetProfileResponse> {
        this.checkAccess(userContext, userId);
        return this.get(userId);
    }

    async add(createProfileRequest: CreateProfileRequest): Promise<ProfileDto> {
        return await this.profilesDatabaseService.create(userId, createProfileRequest);
    }

    async update(userId: string, updateProfileRequest: UpdateProfileRequest): Promise<ProfileDto> {
        return await this.profilesDatabaseService.update(userId, updateProfileRequest);
    }

    async updateWithAccessCheck(userContext: UserContext, userId: string, updateProfileRequest: UpdateProfileRequest): Promise<ProfileDto> {
        this.checkAccess(userContext, userId);
        return this.update(userId, updateProfileRequest);
    }

    async delete(userId: string): Promise<void> {
        return this.profilesDatabaseService.delete(userId);
    }

    async deleteWithAccessCheck(userContext: UserContext, userId: string): Promise<void> {
        this.checkAccess(userContext, userId);
        return this.delete(userId);
    }
}
