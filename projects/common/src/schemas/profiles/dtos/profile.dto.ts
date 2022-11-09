/**
 * The profile is defined by the client application, so just provide a generic type that can be
 * extended by them, but with typings that match a basic JSON object still.
 */
import {JSONObject} from "./internal/internal-database-profile.dto";

export type ProfileDto<T extends JSONObject> = T;
