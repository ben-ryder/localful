import {DatabaseService} from "../../../services/database/database.service";
import {PostgresError, Row, RowList} from "postgres";
import {PG_UNIQUE_VIOLATION} from "../../../services/database/database-error-codes";
import {
  DatabaseProfileDto,
  ProfileDto,
  ErrorIdentifiers,
  CreateProfileRequest,
  UpdateProfileRequest
} from "@ben-ryder/lfb-common";
import {Injectable} from "@nestjs/common";
import {ResourceRelationshipError} from "../../../services/errors/resource/resource-relationship.error";
import {SystemError} from "../../../services/errors/base/system.error";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error";


@Injectable()
export class ProfilesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: string): string {
    switch (fieldName) {
      case "user_id":
        return "userId";
      case "created_at":
        return "createdAt";
      case "updated_at":
        return "updatedAt";
      default:
        return fieldName;
    }
  }

  private static convertDatabaseDtoToDto(profile: DatabaseProfileDto): ProfileDto {
    return {
      userId: profile.user_id,
      encryptionSecret: profile.encryption_secret,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at
    }
  }

  private static getDatabaseError(e: any) {
    if (e instanceof PostgresError) {
      if (e.code && e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name === "profiles_user_id_key") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.PROFILE_ALREADY_EXISTS,
            applicationMessage: "A profile already exists for this user."
          })
        }
      }
    }

    return new SystemError({
      message: "Unexpected error while processing profile",
      originalError: e
    })
  }

  async get(userId: string): Promise<ProfileDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseProfileDto[] = [];
    try {
      result = await sql<DatabaseProfileDto[]>`SELECT * FROM profiles WHERE user_id = ${userId}`;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return ProfilesDatabaseService.convertDatabaseDtoToDto(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: ErrorIdentifiers.PROFILE_NOT_FOUND,
        applicationMessage: "The requested profile could not be found."
      })
    }
  }

  async create(userId: string, createProfileDto: CreateProfileRequest): Promise<ProfileDto> {
    const sql = await this.databaseService.getSQL();

    let result: DatabaseProfileDto[] = [];
    try {
      result = await sql<DatabaseProfileDto[]>`
        INSERT INTO profiles(user_id, encryption_secret, created_at, updated_at) 
        VALUES (${userId}, ${createProfileDto.encryptionSecret}, DEFAULT, DEFAULT)
        RETURNING *;
       `;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return ProfilesDatabaseService.convertDatabaseDtoToDto(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning profile after creation",
      })
    }
  }

  async update(userId: string, updatedUser: UpdateProfileRequest): Promise<ProfileDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(updatedUser).length === 0) {
      return this.get(userId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    const updateObject: any = {};
    for (const fieldName of Object.keys(updatedUser) as Array<keyof UpdateProfileRequest>) {
      updateObject[ProfilesDatabaseService.mapApplicationField(fieldName)] = updatedUser[fieldName];
    }

    let result: DatabaseProfileDto[] = [];
    try {
      result = await sql<DatabaseProfileDto[]>`
        UPDATE profiles
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE user_id = ${userId}
        RETURNING *;
      `;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return ProfilesDatabaseService.convertDatabaseDtoToDto(result[0]);
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
      throw ProfilesDatabaseService.getDatabaseError(e);
    }

    // If there's a count then rows were affected and the deletion was a success
    // If there's no count but an error wasn't thrown then the entity must not exist
    if (result && result.count) {
      return;
    }
    else {
      throw new ResourceNotFoundError({
        applicationMessage: "The requested profile could not be found."
      })
    }
  }
}
