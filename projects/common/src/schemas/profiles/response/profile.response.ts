import {ProfileDto} from "../dtos/profile.dto";
import {JSONData} from "../json-data";

export type ProfileResponse<T extends JSONData> = ProfileDto<T>;
