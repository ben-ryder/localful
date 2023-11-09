import { SetMetadata } from "@nestjs/common";
import {Roles} from "@ben-ryder/lfb-common";

export interface AccessControlOptions {
  isVerified?: boolean,
  roles?: Roles[]
}

export const ACCESS_CONTROL_METADATA_KEY = "roles";

export const UseAccessControl = (options: AccessControlOptions) => SetMetadata(ACCESS_CONTROL_METADATA_KEY, options);
