import {DatabaseService} from "../../../services/database/database.service";
import {Injectable} from "@nestjs/common";
import {ChangeInternalDatabaseDto, ChangeDto} from "@ben-ryder/lfb-common";
import {SystemError} from "../../../services/errors/base/system.error";
import {Row, RowList} from "postgres";
import {ResourceNotFoundError} from "../../../services/errors/resource/resource-not-found.error";


@Injectable()
export class ChangesDatabaseService {
  constructor(
    private readonly databaseService: DatabaseService
  ) {}

  private static convertDatabaseDtoToDto(change: ChangeInternalDatabaseDto): ChangeDto {
    return {
      id: change.id,
      data: change.data,
    }
  }

  private static getDatabaseError(e: any) {
    return new SystemError({
      message: "Unexpected error while executing change query",
      originalError: e
    })
  }

  async add(userId: string, changes: ChangeDto[]) {
    const sql = await this.databaseService.getSQL();

    try {
      for (const change of changes) {
        await sql`
        INSERT INTO changes(id, data, user_id) 
        VALUES (${change.id}, ${change.data}, ${userId})
       `;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }
  }

  async list(userId: string, ids?: string[]): Promise<ChangeDto[]> {
    const sql = await this.databaseService.getSQL();

    let results: ChangeInternalDatabaseDto[] = [];
    try {
      if (ids && ids.length > 0) {
        results = await sql<ChangeInternalDatabaseDto[]>`SELECT * FROM changes WHERE user_id = ${userId} AND id IN ${sql(ids)}`;
      }
      else {
        results = await sql<ChangeInternalDatabaseDto[]>`SELECT * FROM changes WHERE user_id = ${userId}`;
      }
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }

    return results.map(ChangesDatabaseService.convertDatabaseDtoToDto);
  }

  async getIds(userId: string): Promise<string[]> {
    const sql = await this.databaseService.getSQL();

    let results: {id: string}[] = [];
    try {
      results = await sql<{id: string}[]>`SELECT id FROM changes WHERE user_id = ${userId}`;
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }

    return results.map(result => result.id);
  }

  async deleteAll(userId: string): Promise<void> {
    const sql = await this.databaseService.getSQL();

    try {
       await sql`DELETE FROM changes WHERE user_id = ${userId}`;
    }
    catch (e: any) {
      throw ChangesDatabaseService.getDatabaseError(e);
    }
  }
}
