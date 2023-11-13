import {UserEntity} from "@localful/common";

export interface TestUserEntity extends UserEntity {
  password: string,
  encryptionKey: string,
  masterKey: string,
  passwordKey: string,
  serverPassword: string,
}
