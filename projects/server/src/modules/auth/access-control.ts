import { SetMetadata } from "@nestjs/common";
import {Permissions} from "@localful/common";

export interface AccessControlOptions {
  isVerified?: boolean,
  scopes?: Permissions[]
}

export const ACCESS_CONTROL_METADATA_KEY = "access-control";

export const UseAccessControl = (options: AccessControlOptions) => SetMetadata(ACCESS_CONTROL_METADATA_KEY, options);
