import {ChangesDatabaseService} from "./database/changes.database.service";
import {Injectable} from "@nestjs/common";
import {ChangeDto} from "@ben-ryder/lfb-common";


@Injectable()
export class ChangesService {
  constructor(
    private changesDatabaseService: ChangesDatabaseService
  ) {}

  async add(owner: string, changes: ChangeDto[]) {
    return this.changesDatabaseService.add(owner, changes);
  }

  async list(owner: string, ids?: string[]) {
    return this.changesDatabaseService.list(owner, ids);
  }

  async getIds(owner: string) {
    return this.changesDatabaseService.getIds(owner);
  }
}
