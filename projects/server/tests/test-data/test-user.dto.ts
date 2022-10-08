import {DatabaseUserDto} from "../../src/common/schemas/users/dtos/internal/database-user.dto";


export interface TestUserDto extends DatabaseUserDto {
  password: string;
  encryptionKey: string;
  masterKey: string,
  passwordKey: string,
  serverPassword: string
}
