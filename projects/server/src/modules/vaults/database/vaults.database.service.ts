import {DatabaseService} from "../../../services/database/database.service";
import {PostgresError, Row, RowList} from "postgres";
import {Injectable} from "@nestjs/common";
import {SystemError} from "../../../services/errors/base/system.error";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error";
import {CreateVaultDto, ErrorIdentifiers, UpdateVaultDto, VaultDto} from "@localful/common";
import {RawDatabaseVault} from "./database-vault";
import {PG_FOREIGN_KEY_VIOLATION} from "../../../services/database/database-error-codes";
import {ResourceRelationshipError} from "../../../services/errors/resource/resource-relationship.error";


@Injectable()
export class VaultsDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case "protected_encryption_key":
        return "protectedEncryptionKey";
      case "protected_data":
        return "protectedData";
      case "owner_id":
        return "ownerId";
      case "createdAt":
        return "created_at";
      case "updatedAt":
        return "updated_at";
      default:
        return fieldName;
    }
  }

  private static convertDatabaseDtoToDto(vault: RawDatabaseVault): VaultDto {
    return {
      id: vault.id,
      name: vault.name,
      protectedEncryptionKey: vault.protected_encryption_key,
      protectedData: vault.protected_data,
      ownerId: vault.owner_id,
      createdAt: vault.created_at,
      updatedAt: vault.updated_at,
    }
  }

  private static getDatabaseError(e: any) {
    if (e instanceof PostgresError) {
      if (e.code && e.code === PG_FOREIGN_KEY_VIOLATION) {
        if (e.constraint_name === "vaults_owner") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.RESOURCE_NOT_FOUND,
            applicationMessage: "Attempted to add a vault with owner that doesn't exist."
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
        identifier: ErrorIdentifiers.RESOURCE_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }

  async create(ownerId: string, createVaultDto: CreateVaultDto): Promise<VaultDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseVault[] = [];
    try {
      result = await sql<RawDatabaseVault[]>`
        INSERT INTO vaults(id, name, protected_encryption_key, protected_data, owner_id, created_at, updated_at) 
        VALUES (${createVaultDto.id}, ${createVaultDto.name}, ${createVaultDto.protectedEncryptionKey}, ${createVaultDto.protectedData || null}, ${ownerId}, ${createVaultDto.createdAt}, ${createVaultDto.updatedAt})
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
        identifier: ErrorIdentifiers.RESOURCE_NOT_FOUND,
        applicationMessage: "The requested vault could not be found."
      })
    }
  }
}
