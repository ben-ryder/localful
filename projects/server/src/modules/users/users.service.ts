import {PasswordService} from "../../services/password/password.service.js";
import {UsersDatabaseService} from "./database/users.database.service.js";
import {Injectable} from "@nestjs/common";
import {
    CreateUserDto,
    UpdateUserDto,
    UserDto
} from "@localful/common";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error.js";
import {UserContext} from "../../common/request-context.decorator.js";
import {DatabaseUserDto} from "./database/database-user.js";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService
    ) {}

    // @todo: replace with auth system checks
    checkAccess(userContext: UserContext, userId: string): void {
        if (userContext?.id !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(userId: string): Promise<UserDto> {
        const user = await this.usersDatabaseService.get(userId);
        return this.removePasswordFromUser(user);
    }

    async getWithAccessCheck(userContext: UserContext, userId: string): Promise<UserDto> {
        this.checkAccess(userContext, userId);
        return this.get(userId);
    }

    removePasswordFromUser(userWithPassword: DatabaseUserDto): UserDto {
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

    async update(userId: string, updateUserDto: UpdateUserRequest): Promise<UserDto> {
        const databaseUpdate: UpdateDatabaseUserDto = {};

        if (updateUserDto.username) {
            databaseUpdate.username = updateUserDto.username;
        }
        if (updateUserDto.encryptionSecret) {
            databaseUpdate.encryptionSecret = updateUserDto.encryptionSecret;
        }
        if (updateUserDto.password) {
            // todo: make password change go via password reset
            databaseUpdate.passwordHash = await PasswordService.hashPassword(updateUserDto.password);
        }
        if (updateUserDto.email) {
            databaseUpdate.email = updateUserDto.email;
            databaseUpdate.isVerified = false;
        }

        const user = await this.usersDatabaseService.update(userId, databaseUpdate);
        return this.removePasswordFromUser(user);
    }

    async updateWithAccessCheck(userContext: UserContext, userId: string, updateUserDto: UpdateUserRequest): Promise<UpdateUserResponse> {
        this.checkAccess(userContext, userId);
        return this.update(userId, updateUserDto);
    }

    async delete(userId: string): Promise<void> {
        return this.usersDatabaseService.delete(userId);
    }

    async deleteWithAccessCheck(userContext: UserContext, userId: string): Promise<void> {
        this.checkAccess(userContext, userId);
        return this.delete(userId);
    }
}
