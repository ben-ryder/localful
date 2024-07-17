import {PasswordService} from "../../services/password/password.service";
import {UsersDatabaseService} from "./database/users.database.service";
import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {
    CreateUserDto, ErrorIdentifiers,
    UpdateUserDto,
    UserDto,
} from "@localful/common";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {UserContext} from "../../common/request-context.decorator";
import {DatabaseCreateUserDto, DatabaseUpdateUserDto, DatabaseUserDto} from "./database/database-user";
import {AuthService} from "../auth/auth.service";
import {ConfigService} from "../../services/config/config";
import {ResourceNotFoundError} from "../../services/errors/resource/resource-not-found.error";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService,
       @Inject(forwardRef(() => AuthService))
       public authService: AuthService,
       public configService: ConfigService,
    ) {}

    async _UNSAFE_get(userId: string): Promise<UserDto> {
        const user = await this.usersDatabaseService.get(userId);
        return this.convertDatabaseDto(user);
    }

    async get(userContext: UserContext, userId: string): Promise<UserDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["users:retrieve"],
            unscopedPermissions: ["users:retrieve:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_get(userId);
    }

    convertDatabaseDto(userWithPassword: DatabaseUserDto): UserDto {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...userDto } = userWithPassword;
        return userDto;
    }

    async getDatabaseUser(email: string): Promise<DatabaseUserDto> {
        return this.usersDatabaseService.getByEmail(email);
    }

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        // todo: add additional permission based access control? an anonymous role and user context would need adding
        if (!this.configService.config.app.registrationEnabled) {
            throw new AccessForbiddenError({
                identifier: ErrorIdentifiers.USER_REGISTRATION_DISABLED,
                applicationMessage: "User registration is currently disabled."
            })
        }

        const passwordHash = await PasswordService.hashPassword(createUserDto.password);

        const databaseCreateUserDto: DatabaseCreateUserDto = {
            displayName: createUserDto.displayName,
            email: createUserDto.email,
            passwordHash,
            role: "user",
        }

        const databaseUser = await this.usersDatabaseService.create(databaseCreateUserDto);
        return this.convertDatabaseDto(databaseUser);
    }

    private async _UNSAFE_update(userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        const databaseUpdateDto: DatabaseUpdateUserDto = {}

        if (updateUserDto.displayName) {
            databaseUpdateDto.displayName = updateUserDto.displayName;
        }
        // todo: don't allow email and password updates? Require this to go via verification email?
        if (updateUserDto.email) {
            databaseUpdateDto.email = updateUserDto.email;
            databaseUpdateDto.isVerified = false;
        }
        if (updateUserDto.password) {
            databaseUpdateDto.passwordHash = await PasswordService.hashPassword(updateUserDto.password);
        }

        const user = await this.usersDatabaseService.update(userId, databaseUpdateDto);
        return this.convertDatabaseDto(user);
    }

    async update(userContext: UserContext, userId: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["users:update"],
            unscopedPermissions: ["users:update:all"],
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
            unscopedPermissions: ["users:delete:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_delete(userId);
    }
}
