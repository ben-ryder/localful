import { PasswordService } from "../../services/password/password.service";
import {UsersDatabaseService} from "./database/users.database.service";
import {Injectable} from "@nestjs/common";
import {
    GetUserResponse,
    DatabaseUserDto,
    CreateUserRequest,
    UpdateUserRequest,
    UpdateDatabaseUserDto,
    UpdateUserResponse,
    UserDto
} from "@ben-ryder/lfb-common";
import {AccessForbiddenError} from "../../services/errors/access/access-forbidden.error";
import {UserContext} from "../../common/request-context.decorator";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService
    ) {}

    checkAccess(userContext: UserContext, userId: string): void {
        if (userContext?.id !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(userId: string): Promise<GetUserResponse> {
        const user = await this.usersDatabaseService.get(userId);
        return this.removePasswordFromUser(user);
    }

    async getWithAccessCheck(userContext: UserContext, userId: string): Promise<GetUserResponse> {
        this.checkAccess(userContext, userId);
        return this.get(userId);
    }

    removePasswordFromUser(userWithPassword: DatabaseUserDto): UserDto {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, ...userDto } = userWithPassword;
        return userDto;
    }

    async getWithPasswordByUsername(username: string): Promise<DatabaseUserDto> {
        return this.usersDatabaseService.getByUsername(username);
    }

    async add(createUserDto: CreateUserRequest): Promise<UserDto> {
        const passwordHash = await PasswordService.hashPassword(createUserDto.password);

        const user = {
            username: createUserDto.username,
            email: createUserDto.email,
            encryptionSecret: createUserDto.encryptionSecret,
            passwordHash
        }

        const resultUser = await this.usersDatabaseService.create(user);
        return this.removePasswordFromUser(resultUser);
    }

    async update(userId: string, updateUserDto: UpdateUserRequest): Promise<UserDto> {
        let newPasswordHash: string|null = null;
        if (updateUserDto.password) {
            newPasswordHash = await PasswordService.hashPassword(updateUserDto.password);

            // Replace the password field with the .passwordHash field
            delete updateUserDto.password;
        }

        const updatedUser: UpdateDatabaseUserDto = {...updateUserDto};
        if (newPasswordHash) {
            updatedUser.passwordHash = newPasswordHash;
        }

        const user = await this.usersDatabaseService.update(userId, updateUserDto);
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
