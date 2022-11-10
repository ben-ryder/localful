/**
 * The profile is defined by the client application, so just provide a generic type that can be
 * extended by them, but with typings that match a basic JSON object still.
 */
import {JSONData} from "../json-data";

export type ProfileDto<T extends JSONData> = T;
