import {DatabaseService} from "../../../services/database/database.service.js";
import {Injectable} from "@nestjs/common";
import {ChangeDto, ChangesQueryParams} from "@localful/common";
import {SystemError} from "../../../services/errors/base/system.error.js";
import {RawDatabaseChange} from "./database-change.js";


@Injectable()
export class ChangesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static convertDatabaseDtoToDto(change: RawDatabaseChange): ChangeDto {
    return {
      id: change.id,
      resourceId: change.resource_id,
      protectedData: change.protected_data,
      createdAt: change.created_at,
    }
  }

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing change query",
      originalError: e
    })
  }

  async createMany(changes: ChangeDto[]) {
    const sql = await this.databaseService.getSQL();

    try {
      for (const change of changes) {
        await sql`
        INSERT INTO changes(id, resource_id, protected_data, created_at)
        VALUES (${change.id}, ${change.resourceId}, ${change.protectedData}, ${change.createdAt})
       `;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }
  }

  async search(params: ChangesQueryParams): Promise<ChangeDto[]> {
    const sql = await this.databaseService.getSQL();

    // todo: built query based on params too.

    let results: RawDatabaseChange[] = [];
    try {
      if (params.ids && params.resourceIds) {
        results = await sql<RawDatabaseChange[]>`SELECT * FROM changes WHERE resource_id IN ${sql(params.resourceIds)} AND id IN ${sql(params.ids)}`;
      }
      else if (params.ids) {
        results = await sql<RawDatabaseChange[]>`SELECT * FROM changes WHERE resource_id IN ${sql(params.resourceIds)} AND id IN ${sql(params.ids)}`;
      }
      else if (params.resourceIds) {
        results = await sql<RawDatabaseChange[]>`SELECT * FROM changes WHERE resource_id = ${resourceId}`;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }

    return results.map(ChangesDatabaseService.convertDatabaseDtoToDto);
  }
}
