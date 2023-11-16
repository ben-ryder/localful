import {PasswordService} from "../../services/password/password.service.js";
import {UsersDatabaseService} from "./database/users.database.service.js";
import {Injectable} from "@nestjs/common";
import {
    CreateUserDto,
    UpdateUserDto,
    UserDto,
    Permissions
} from "@localful/common";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error.js";
import {UserContext} from "../../common/request-context.decorator.js";
import {DatabaseUpdateUserDto, DatabaseUserDto} from "./database/database-user.js";
import {AuthService} from "../auth/auth.service.js";
import {UserRequestError} from "../../services/errors/base/user-request.error.js";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService,
       public authService: AuthService,
    ) {}

    private async _UNSAFE_get(userId: string): Promise<UserDto> {
        const user = await this.usersDatabaseService.get(userId);
        return this.removePasswordFromUser(user);
    }

    async get(userContext: UserContext, userId: string): Promise<UserDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["users:retrieve"],
            globalScopedPermissions: ["users:retrieve:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_get(userId);
    }

    private removePasswordFromUser(userWithPassword: DatabaseUserDto): UserDto {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...userDto } = userWithPassword;
        return userDto;
    }

    async getWithPasswordByEmail(email: string): Promise<DatabaseUserDto> {
        return this.usersDatabaseService.getByEmail(email);
    }

    async add(createUserDto: CreateUserDto): Promise<UserDto> {
        const passwordHash = await PasswordService.hashPassword(createUserDto.password);

        const user = {
            email: createUserDto.email,
            protectedEncryptionKey: createUserDto.protectedEncryptionKey,
            passwordHash
        }

        const resultUser = await this.usersDatabaseService.create(user);
        return this.removePasswordFromUser(resultUser);
    }

    private async _UNSAFE_update(userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const databaseUpdateDto: DatabaseUpdateUserDto = {}

        // @todo: should validate that protectedEncryptionKey & protectedAdditionalData are updated if password is?
        if (updateUserDto.displayName) {
            databaseUpdateDto.displayName
        }
        if (updateUserDto.email) {
            databaseUpdateDto.email = updateUserDto.email;
            databaseUpdateDto.isVerified = false;
        }
        if (updateUserDto.protectedAdditionalData) {
            databaseUpdateDto.protectedAdditionalData
        }
        if (updateUserDto.password) {
            databaseUpdateDto.passwordHash = await PasswordService.hashPassword(updateUserDto.password);
        }
        if (updateUserDto.protectedEncryptionKey) {
            updateUserDto.protectedEncryptionKey
        }


        const user = await this.usersDatabaseService.update(userId, databaseUpdateDto);
        return this.removePasswordFromUser(user);
    }

    async update(userContext: UserContext, userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["users:retrieve"],
            globalScopedPermissions: ["users:retrieve:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_update(userId, updateUserDto);
    }

    private async _UNSAFE_delete(userId: string): Promise<void> {
        return this.usersDatabaseService.delete(userId);
    }

    async delete(userContext: UserContext, userId: string): Promise<void> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["users:delete"],
            globalScopedPermissions: ["users:delete:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_delete(userId);
    }
}
