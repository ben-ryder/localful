import {DatabaseUserDto} from "@ben-ryder/lfb-common";


export interface TestUserDto extends DatabaseUserDto {
  password: string;
  encryptionKey: string;
  masterKey: string,
  passwordKey: string,
  serverPassword: string
}
