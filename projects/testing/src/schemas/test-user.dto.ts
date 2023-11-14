import {UserEntity} from "@localful/common";

export interface TestUserEntity extends UserEntity {
  passwordHash: string,
  serverPassword: string,
  masterEncryptionKey: string,
}
