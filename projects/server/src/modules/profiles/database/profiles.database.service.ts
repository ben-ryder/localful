import {DatabaseService} from "../../../services/database/database.service";
import {Injectable} from "@nestjs/common";
import {InternalDatabaseProfileDto, JSONObject, ProfileDto} from "@ben-ryder/lfb-common";
import {SystemError} from "../../../services/errors/base/system.error";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error";


@Injectable()
export class ProfilesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static convertDatabaseDtoToDto(change: InternalDatabaseProfileDto): ProfileDto<any> {
    return {
      id: change.userId,
      data: change.data,
    }
  }

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing change query",
      originalError: e
    })
  }

  async get(userId: string) {
    const sql = await this.databaseService.getSQL();

    let result: InternalDatabaseProfileDto[] = [];
    try {
      result = await sql<InternalDatabaseProfileDto[]>`SELECT * FROM profiles WHERE user_id = ${userId}`;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }

    if (result.length === 0) {
      throw new ResourceNotFoundError({});
    }

    return ProfilesDatabaseService.convertDatabaseDtoToDto(result[0]);
  }

  async upsert(userId: string, data: JSONObject) {
    const sql = await this.databaseService.getSQL();

    try {
      await sql<InternalDatabaseProfileDto[]>`
        INSERT INTO profiles(user_id, data, created_at, updated_at) 
        VALUES (${userId}, ${data}, DEFAULT, DEFAULT)
        ON CONFLICT (user_id)
        DO UPDATE SET data=EXCLUDED.data;
       `;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }
  }

  async delete(userId: string) {
    const sql = await this.databaseService.getSQL();

    try {
      await sql<InternalDatabaseProfileDto[]>`DELETE FROM profiles WHERE user_id = ${userId}`;
    }
    catch (e: any) {
      throw ProfilesDatabaseService.getDatabaseError(e);
    }
  }
}
