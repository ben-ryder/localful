import databaseService, {DatabaseService} from "@services/database/database.service.js";
import {RawDatabaseVault} from "@modules/vaults/database/database-vault.js";
import {CreateVaultDto, ErrorIdentifiers, UpdateVaultDto, VaultDto} from "@localful/common";
import {PostgresError, Row, RowList} from "postgres";
import {PG_FOREIGN_KEY_VIOLATION, PG_UNIQUE_VIOLATION} from "@services/database/database-error-codes.js";
import {ResourceRelationshipError} from "@services/errors/resource/resource-relationship.error.js";
import {SystemError} from "@services/errors/base/system.error.js";
import {ResourceNotFoundError} from "@services/errors/resource/resource-not-found.error.js";


export class VaultsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case "name":
        return "vault_name"
      case "protectedEncryptionKey":
        return "protected_encryption_key";
      case "protectedData":
        return "protected_data";
      case "ownerId":
        return "owner_id";
      case "createdAt":
        return "created_at";
      case "updatedAt":
        return "updated_at";
      case "deletedAt":
        return "deleted_at";
      default:
        return fieldName;
    }
  }

  private static convertDatabaseDtoToDto(vault: RawDatabaseVault): VaultDto {
    return {
      id: vault.id,
      name: vault.vault_name,
      protectedEncryptionKey: vault.protected_encryption_key,
      protectedData: vault.protected_data,
      ownerId: vault.owner_id,
      createdAt: vault.created_at,
      updatedAt: vault.updated_at,
      deletedAt: vault.deleted_at
    }
  }

  private static getDatabaseError(e: any) {
    if (e instanceof PostgresError && e.code) {
      if (e.code === PG_FOREIGN_KEY_VIOLATION) {
        if (e.constraint_name === "vault_owner") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.USER_NOT_FOUND,
            applicationMessage: "Attempted to add a vault with owner that doesn't exist."
          })
        }
      }
      if (e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name === "vault_name_unique") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.VAULT_NAME_EXISTS,
            applicationMessage: "Vault owner already has vault with the given name."
          })
        }
        else if (e.constraint_name === "vaults_pk") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.RESOURCE_NOT_UNIQUE,
            applicationMessage: "Vault with given id already exists."
          })
        }
      }
    }

    return new SystemError({
      message: "Unexpected error while executing vault query",
      originalError: e
    })
  }

  async get(vaultId: string): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseVault[] = [];
    try {
      result = await sql<RawDatabaseVault[]>`SELECT * FROM vaults WHERE id = ${vaultId}`;
    }
    catch (e: any) {
      throw VaultsDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return VaultsDatabaseService.convertDatabaseDtoToDto(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: ErrorIdentifiers.VAULT_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }

  async create(createVaultDto: CreateVaultDto): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseVault[] = [];
    try {
      result = await sql<RawDatabaseVault[]>`
        INSERT INTO vaults(id, vault_name, protected_encryption_key, protected_data, owner_id, created_at, updated_at, deleted_at) 
        VALUES (${createVaultDto.id}, ${createVaultDto.name}, ${createVaultDto.protectedEncryptionKey}, ${createVaultDto.protectedData || null}, ${createVaultDto.ownerId}, ${createVaultDto.createdAt}, ${createVaultDto.updatedAt}, DEFAULT)
        RETURNING *;
       `;
    }
    catch (e: any) {
      throw VaultsDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return VaultsDatabaseService.convertDatabaseDtoToDto(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning vault after creation",
      })
    }
  }

  async update(id: string, updateVaultDto: UpdateVaultDto): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(updateVaultDto).length === 0) {
      return this.get(id);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    const updateObject: any = {};
    for (const fieldName of Object.keys(updateVaultDto) as Array<keyof UpdateVaultDto>) {
      updateObject[VaultsDatabaseService.mapApplicationField(fieldName)] = updateVaultDto[fieldName];
    }

    let result: RawDatabaseVault[] = [];
    try {
      result = await sql<RawDatabaseVault[]>`
        UPDATE vaults
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE id = ${id}
        RETURNING *;
      `;
    }
    catch (e: any) {
      throw VaultsDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return VaultsDatabaseService.convertDatabaseDtoToDto(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning vault after update",
      })
    }
  }

  async delete(id: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM vaults WHERE id = ${id}`;
    }
    catch (e: any) {
      throw VaultsDatabaseService.getDatabaseError(e);
    }

    // If there's a count then rows were affected and the deletion was a success
    // If there's no count but an error wasn't thrown then the entity must not exist
    if (result && result.count) {
      return;
    }
    else {
      throw new ResourceNotFoundError({
        identifier: ErrorIdentifiers.VAULT_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }
}

const vaultsDatabaseService = new VaultsDatabaseService(databaseService)
export default vaultsDatabaseService
