import {TokenPair} from "../tokens.js";
import {UserDto} from "../../users.js";

export interface LoginResponse {
  tokens: TokenPair;
  user: UserDto;
}