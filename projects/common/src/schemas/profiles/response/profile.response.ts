import {ProfileDto} from "../dtos/profile.dto";
import {JSONObject} from "../dtos/internal/internal-database-profile.dto";

export type ProfileResponse<T extends JSONObject> = ProfileDto<T>;
