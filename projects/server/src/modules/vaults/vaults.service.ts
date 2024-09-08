import vaultsDatabaseService, {VaultsDatabaseService} from "@modules/vaults/database/vaults.database.service.js";
import authService, {AuthService} from "@modules/auth/auth.service.js";
import {UserContext} from "@common/request-context.js";
import {CreateVaultDto, UpdateVaultDto, VaultDto} from "@localful/common";


export class VaultsService {
    constructor(
       private vaultsDatabaseService: VaultsDatabaseService,
       public authService: AuthService,
    ) {}

    async _UNSAFE_get(id: string) {
        return await this.vaultsDatabaseService.get(id);
    }

    async get(userContext: UserContext, id: string) {
        const vault = await this._UNSAFE_get(id);

        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:retrieve"],
            unscopedPermissions: ["vaults:retrieve:all"],
            requestingUserContext: userContext,
            targetUserId: vault.ownerId
        })
        
        return vault
    }

    async _UNSAFE_create(createVaultDto: CreateVaultDto): Promise<VaultDto> {
        return await this.vaultsDatabaseService.create(createVaultDto);
    }

    async create(userContext: UserContext, createVaultDto: CreateVaultDto): Promise<VaultDto> {
        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:create"],
            unscopedPermissions: ["vaults:create:all"],
            requestingUserContext: userContext,
            targetUserId: createVaultDto.ownerId
        })
        
        return await this._UNSAFE_create(createVaultDto);
    }

    async _UNSAFE_update(id: string, updateVaultDto: UpdateVaultDto): Promise<VaultDto> {
        return await this.vaultsDatabaseService.update(id, updateVaultDto);
    }

    async update(userContext: UserContext, id: string, updateVaultDto: UpdateVaultDto): Promise<VaultDto> {
        const vault = await this._UNSAFE_get(id);

        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:update"],
            unscopedPermissions: ["vaults:update:all"],
            requestingUserContext: userContext,
            targetUserId: vault.ownerId
        })
        
        return this._UNSAFE_update(id, updateVaultDto);
    }

    async _UNSAFE_delete(id: string): Promise<void> {
        await this.vaultsDatabaseService.delete(id);
    }

    async delete(userContext: UserContext, id: string): Promise<void> {
        const vault = await this._UNSAFE_get(id);

        await this.authService.validateAccessControlRules({
            userScopedPermissions: ["vaults:delete"],
            unscopedPermissions: ["vaults:delete:all"],
            requestingUserContext: userContext,
            targetUserId: vault.ownerId
        })

        return this._UNSAFE_delete(id);
    }
}

const vaultsService = new VaultsService(vaultsDatabaseService, authService);
export default vaultsService;
