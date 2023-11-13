import {TokenPair} from "../tokens.js";
import {UserDto} from "../../users/users.js";

export interface LoginResponse {
  tokens: TokenPair;
  user: UserDto;
}