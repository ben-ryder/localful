import {UserEntity} from "@ben-ryder/lfb-common";

export interface TestUserEntity extends UserEntity {
  password: string,
  encryptionKey: string,
  masterKey: string,
  passwordKey: string,
  serverPassword: string,
}
