import {DatabaseService} from "../../../services/database/database.service.js";
import {PostgresError, Row, RowList} from "postgres";
import {PG_UNIQUE_VIOLATION} from "../../../services/database/database-error-codes.js";
import {CreateUserDto} from "@localful/common";
import {ErrorIdentifiers} from "@localful/common";
import {Injectable} from "@nestjs/common";
import {ResourceRelationshipError} from "../../../services/errors/resource/resource-relationship.error.js";
import {SystemError} from "../../../services/errors/base/system.error.js";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error.js";
import {DatabaseUpdateUserDto, DatabaseUserDto, RawDatabaseUser} from "./database-user.js";


@Injectable()
export class UsersDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: keyof DatabaseUserDto): keyof RawDatabaseUser {
    switch (fieldName) {
      case "passwordHash":
        return "password_hash";
      case "protectedEncryptionKey":
        return "protected_encryption_key";
      case "protectedAdditionalData":
        return "protected_additional_data"
      case "createdAt":
        return "created_at";
      case "updatedAt":
        return "updated_at";
      case "displayName":
        return "display_name"
      case "isVerified":
        return "is_verified"
      default:
        return fieldName;
    }
  }

  private static convertRawUserToDto(user: RawDatabaseUser): DatabaseUserDto {
    return {
      id: user.id,
      displayName: user.display_name,
      email: user.email,
      passwordHash: user.password_hash,
      isVerified: user.is_verified,
      role: user.role,
      protectedEncryptionKey: user.protected_encryption_key,
      protectedAdditionalData: user.protected_additional_data,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }
  }

  private static getDatabaseError(e: any) {
    if (e instanceof PostgresError) {
      if (e.code && e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name == "users_email_key") {
          return new ResourceRelationshipError({
            identifier: ErrorIdentifiers.USER_EMAIL_EXISTS,
            applicationMessage: "The supplied email address is already in use."
          })
        }
      }
    }

    return new SystemError({
      message: "Unexpected error while creating user",
      originalError: e
    })
  }

  async get(userId: string): Promise<DatabaseUserDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseUser[] = [];
    try {
      result = await sql<RawDatabaseUser[]>`SELECT * FROM users WHERE id = ${userId}`;
    }
    catch (e: any) {
      throw UsersDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return UsersDatabaseService.convertRawUserToDto(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: ErrorIdentifiers.USER_NOT_FOUND,
        applicationMessage: "The requested user could not be found."
      })
    }
  }

  async getByEmail(email: string): Promise<DatabaseUserDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseUser[] = [];
    try {
      result = await sql<RawDatabaseUser[]>`SELECT * FROM users WHERE email = ${email}`;
    }
    catch (e: any) {
      throw UsersDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return UsersDatabaseService.convertRawUserToDto(result[0]);
    }
    else {
      throw new ResourceNotFoundError({
        identifier: ErrorIdentifiers.USER_NOT_FOUND,
        applicationMessage: "The requested user could not be found."
      })
    }
  }

  async create(user: CreateUserDto): Promise<DatabaseUserDto> {
    const sql = await this.databaseService.getSQL();

    /**
     *       id: user.id,
     *       displayName: user.display_name,
     *       email: user.email,
     *       passwordHash: user.password_hash,
     *       isVerified: user.is_verified,
     *       role: user.role,
     *       protectedEncryptionKey: user.protected_encryption_key,
     *       protectedAdditionalData: user.protected_additional_data,
     *       createdAt: user.created_at,
     *       updatedAt: user.updated_at
     */

    let result: RawDatabaseUser[] = [];
    try {
      result = await sql<RawDatabaseUser[]>`
        INSERT INTO users(id, display_name, email, password_hash, is_verified, role , protected_encryption_key, protected_additional_data, created_at, updated_at) 
        VALUES (DEFAULT, ${user.displayName}, ${user.email}, ${user.password}, DEFAULT, ${user.role}, ${user.protectedEncryptionKey}, ${user.protectedAdditionalData}, DEFAULT, DEFAULT)
        RETURNING *;
       `;
    }
    catch (e: any) {
      throw UsersDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return UsersDatabaseService.convertRawUserToDto(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning user after creation",
      })
    }
  }

  async update(userId: string, databaseUpdateUserDto: DatabaseUpdateUserDto): Promise<DatabaseUserDto> {
    const sql = await this.databaseService.getSQL();

    // If there are no supplied fields to update, then just return the existing user.
    if (Object.keys(databaseUpdateUserDto).length === 0) {
      return this.get(userId);
    }

    // Process all fields
    // todo: this offers no protection against updating fields like id which should never be updated
    const updateObject: any = {};
    for (const fieldName of Object.keys(databaseUpdateUserDto) as Array<keyof DatabaseUpdateUserDto>) {
      updateObject[UsersDatabaseService.mapApplicationField(fieldName)] = databaseUpdateUserDto[fieldName];
    }

    let result: RawDatabaseUser[] = [];
    try {
      result = await sql<RawDatabaseUser[]>`
        UPDATE users
        SET ${sql(updateObject, ...Object.keys(updateObject))}
        WHERE id = ${userId}
        RETURNING *;
      `;
    }
    catch (e: any) {
      throw UsersDatabaseService.getDatabaseError(e);
    }

    if (result.length > 0) {
      return UsersDatabaseService.convertRawUserToDto(result[0]);
    }
    else {
      throw new SystemError({
        message: "Unexpected error returning user after creation",
      })
    }
  }

  async delete(userId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    let result: RowList<Row[]>;
    try {
      result = await sql`DELETE FROM users WHERE id = ${userId}`;
    }
    catch (e: any) {
      throw UsersDatabaseService.getDatabaseError(e);
    }

    // If there's a count then rows were affected and the deletion was a success
    // If there's no count but an error wasn't thrown then the entity must not exist
    if (result && result.count) {
      return;
    }
    else {
      throw new ResourceNotFoundError({
        applicationMessage: "The requested user could not be found."
      })
    }
  }
}
