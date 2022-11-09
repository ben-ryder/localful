import {ChangeDto} from "../change.dto";

export interface InternalDatabaseChangeDto extends ChangeDto {
  userId: string;
}
