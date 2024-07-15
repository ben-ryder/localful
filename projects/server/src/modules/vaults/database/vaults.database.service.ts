import {DatabaseService} from "../../../services/database/database.service";
import {PostgresError, Row, RowList} from "postgres";
import {PG_UNIQUE_VIOLATION} from "../../../services/database/database-error-codes";
import {Injectable} from "@nestjs/common";
import {ResourceRelationshipError} from "../../../services/errors/resource/resource-relationship.error";
import {SystemError} from "../../../services/errors/base/system.error";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error";
import {CreateVaultDto, ErrorIdentifiers, VaultDto} from "@localful/common";
import {RawDatabaseVault} from "./database-vault";


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
      if (e.code && e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name === "profiles_pkey") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.RESOURCE_NOT_UNIQUE,
            applicationMessage: "A profile already exists for that user."
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
        INSERT INTO vaults(id, name, protected_encryption_key, protected_data, owner_id, createdAt, updatedAt) 
        VALUES (DEFAULT, ${createVaultDto.name}, ${createVaultDto.protectedEncryptionKey}, ${createVaultDto.protectedData}, ${ownerId}, DEFAULT, DEFAULT)
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

  async update(userId: string, profileUpdateDto: ProfileUpdateDto): Promise<ProfileDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(profileUpdateDto).length === 0) {
      return this.get(userId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    const updateObject: any = {};
    for (const fieldName of Object.keys(profileUpdateDto) as Array<keyof ProfileUpdateDto>) {
      updateObject[VaultsDatabaseService.mapApplicationField(fieldName)] = profileUpdateDto[fieldName];
    }

    let result: ProfileInternalDatabaseDto[] = [];
    try {
      result = await sql<ProfileInternalDatabaseDto[]>`
        UPDATE profiles
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE user_id = ${userId}
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
        message: "Unexpected error returning profile after update",
      })
    }
  }

  async delete(userId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM profiles WHERE user_id = ${userId}`;
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
        identifier: ErrorIdentifiers.PROFILE_NOT_FOUND,
        applicationMessage: "The requested profile could not be found."
      })
    }
  }
}
