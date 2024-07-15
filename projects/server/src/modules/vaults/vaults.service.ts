import {VaultsDatabaseService} from "./database/vaults.database.service";
import {forwardRef, Inject, Injectable} from "@nestjs/common";
import {UserContext} from "../../common/request-context.decorator";
import {AuthService} from "../auth/auth.service";
import {CreateVaultDto, UpdateVaultDto, VaultDto} from "@localful/common";


@Injectable()
export class VaultsService {
    constructor(
       private vaultsDatabaseService: VaultsDatabaseService,
       @Inject(forwardRef(() => AuthService))
       public authService: AuthService,
    ) {}

    async _UNSAFE_get(userId: string) {
        return await this.vaultsDatabaseService.get(userId);
    }

    async get(userContext: UserContext, userId: string) {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:retrieve"],
            globalScopedPermissions: ["vaults:retrieve:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })
        
        return this._UNSAFE_get(userId);
    }

    async _UNSAFE_create(ownerId: string, createVaultDto: CreateVaultDto): Promise<VaultDto> {
        return await this.vaultsDatabaseService.create(ownerId, createVaultDto);
    }

    async create(userContext: UserContext, createVaultDto: CreateVaultDto): Promise<VaultDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:create"],
            globalScopedPermissions: ["vaults:create:all"],
            requestingUserContext: userContext,
            targetUserId: userContext.id
        })
        
        return await this._UNSAFE_create(userContext.id, createVaultDto);
    }

    async _UNSAFE_update(userId: string, updateVaultDto: UpdateVaultDto): Promise<VaultDto> {
        return await this.vaultsDatabaseService.update(userId, updateVaultDto);
    }

    async update(userContext: UserContext, userId: string, updateVaultDto: UpdateVaultDto): Promise<VaultDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:update"],
            globalScopedPermissions: ["vaults:update:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })
        
        return this._UNSAFE_update(userId, updateVaultDto);
    }

    async _UNSAFE_delete(userId: string): Promise<void> {
        await this.vaultsDatabaseService.delete(userId);
    }

    async delete(userContext: UserContext, userId: string): Promise<void> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:delete"],
            globalScopedPermissions: ["vaults:delete:all"],
            requestingUserContext: userContext,
            targetUserId: userId
        })

        return this._UNSAFE_delete(userId);
    }
}
