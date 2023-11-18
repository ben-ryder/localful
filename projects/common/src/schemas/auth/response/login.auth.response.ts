import {TokenPair} from "../tokens";
import {UserDto} from "../../users/users";

export interface LoginResponse {
  tokens: TokenPair;
  user: UserDto;
}