import { PasswordService } from "../../services/password/password.service";
import {UsersDatabaseService} from "./database/users.database.service";
import {Injectable} from "@nestjs/common";
import {AccessForbiddenError} from "../../common/errors/access/access-forbidden.error";
import {GetUserResponse} from "../../common/schemas/users/response/get.user.response";
import {DatabaseUserDto} from "../../common/schemas/users/dtos/internal/database-user.dto";
import {UserDto} from "../../common/schemas/users/dtos/user.dto";
import {CreateUserRequest} from "../../common/schemas/users/request/create.users.request";
import {UpdateUserRequest} from "../../common/schemas/users/request/update.users.request";
import {UpdateDatabaseUserDto} from "../../common/schemas/users/dtos/internal/update.database-user.dto";
import {UpdateUserResponse} from "../../common/schemas/users/response/update.users.response";


@Injectable()
export class UsersService {
    constructor(
       private usersDatabaseService: UsersDatabaseService
    ) {}

    checkAccess(requestUserId: string, userId: string): void {
        if (requestUserId !== userId) {
            throw new AccessForbiddenError({
                message: "Access forbidden to user"
            })
        }
    }

    async get(userId: string): Promise<GetUserResponse> {
        const user = await this.usersDatabaseService.get(userId);
        return this.removePasswordFromUser(user);
    }

    async getWithAccessCheck(requestUserId: string, userId: string): Promise<GetUserResponse> {
        this.checkAccess(requestUserId, userId);
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

    async updateWithAccessCheck(requestUserId: string, userId: string, updateUserDto: UpdateUserRequest): Promise<UpdateUserResponse> {
        this.checkAccess(requestUserId, userId);
        return this.update(userId, updateUserDto);
    }

    async delete(userId: string): Promise<void> {
        return this.usersDatabaseService.delete(userId);
    }

    async deleteWithAccessCheck(requestUserId: string, userId: string): Promise<void> {
        this.checkAccess(requestUserId, userId);
        return this.delete(userId);
    }
}