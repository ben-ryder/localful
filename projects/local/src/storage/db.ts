import { Dexie, Table } from 'dexie';
import {ChangeDto} from "@localful/common";


export class ChangesDatabase extends Dexie {
  changes!: Table<ChangeDto>;

  constructor() {
    super('changes');
    this.version(1).stores({
      changes: '&id'
    });
  }
}

export const db = new ChangesDatabase();
