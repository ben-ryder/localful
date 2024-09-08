import postgres, {Row, RowList} from "postgres";

import {ErrorIdentifiers} from "@localful/common";

import {
  DatabaseCreateUserDto,
  DatabaseUpdateUserDto,
  DatabaseUserDto,
  RawDatabaseUser
} from "@modules/users/database/database-user.js";
import {DatabaseService} from "@services/database/database.service.js";
import {PG_UNIQUE_VIOLATION} from "@services/database/database-error-codes.js";
import {ResourceRelationshipError} from "@services/errors/resource/resource-relationship.error.js";
import {SystemError} from "@services/errors/base/system.error.js";
import {ResourceNotFoundError} from "@services/errors/resource/resource-not-found.error.js";
import {Injectable} from "@common/injection/injectable-decorator.js";


@Injectable()
export class UsersDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static mapApplicationField(fieldName: keyof DatabaseUserDto): keyof RawDatabaseUser {
    switch (fieldName) {
      case "passwordHash":
        return "password_hash";
      case "createdAt":
        return "created_at";
      case "updatedAt":
        return "updated_at";
      case "displayName":
        return "display_name"
      case "verifiedAt":
        return "verified_at"
      case "firstVerifiedAt":
        return "first_verified_at"
      default:
        return fieldName;
    }
  }

  private static convertRawUserToDto(user: RawDatabaseUser): DatabaseUserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      passwordHash: user.password_hash,
      verifiedAt: user.verified_at,
      firstVerifiedAt: user.first_verified_at,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }
  }

  private static getDatabaseError(e: any) {
    if (e instanceof postgres.PostgresError) {
      if (e.code && e.code === PG_UNIQUE_VIOLATION) {
        if (e.constraint_name == "email_unique") {
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

  async create(user: DatabaseCreateUserDto): Promise<DatabaseUserDto> {
    const sql = await this.databaseService.getSQL();

    let result: RawDatabaseUser[] = [];
    try {
      result = await sql<RawDatabaseUser[]>`
        INSERT INTO users(id, email, display_name, password_hash, verified_at, first_verified_at, role, created_at, updated_at) 
        VALUES (DEFAULT, ${user.email}, ${user.displayName}, ${user.passwordHash}, DEFAULT, DEFAULT, ${user.role}, DEFAULT, DEFAULT)
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

  async _UNSAFE_update() {

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
