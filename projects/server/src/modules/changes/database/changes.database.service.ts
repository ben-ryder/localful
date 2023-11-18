import {DatabaseService} from "../../../services/database/database.service";
import {Injectable} from "@nestjs/common";
import {ChangeDto, ChangesQueryParams} from "@localful/common";
import {SystemError} from "../../../services/errors/base/system.error";
import {RawDatabaseChange} from "./database-change";


@Injectable()
export class ChangesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static convertDatabaseDtoToDto(change: RawDatabaseChange): ChangeDto {
    return {
      id: change.id,
      protectedData: change.protected_data,
      createdAt: change.created_at,
    }
  }

  private static mapApplicationField(fieldName: keyof ChangeDto): keyof RawDatabaseChange {
    switch (fieldName) {
      case "createdAt":
        return "created_at";
      case "protectedData":
        return "protected_data";
      default:
        return fieldName;
    }
  }

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing change query",
      originalError: e
    })
  }

  async createMany(resourceId: string, changes: ChangeDto[]) {
    const sql = await this.databaseService.getSQL();

    try {
      for (const change of changes) {
        await sql`
        INSERT INTO changes(id, resource_id, protected_data, created_at)
        VALUES (${change.id}, ${resourceId}, ${change.protectedData}, ${change.createdAt})
       `;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }
  }

  async list(resourceId: string, params: ChangesQueryParams): Promise<ChangeDto[]> {
    const sql = await this.databaseService.getSQL();

    // Default to only selecting id if no fields are supplied
    const selectColumns: (keyof RawDatabaseChange)[] = params.fields
      ? params.fields.map(ChangesDatabaseService.mapApplicationField)
      : ["id"]

    let results: RawDatabaseChange[] = [];
    try {
      if (params.ids) {
        results = await sql<RawDatabaseChange[]>`SELECT ${sql(selectColumns)} FROM changes WHERE resource_id = ${resourceId} AND id IN ${sql(params.ids)}`;
      }
      else {
        results = await sql<RawDatabaseChange[]>`SELECT ${sql(selectColumns)} FROM changes WHERE resource_id = ${resourceId}`;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }

    return results.map(ChangesDatabaseService.convertDatabaseDtoToDto);
  }
}
