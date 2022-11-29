import {Roles} from "./roles";

export interface TokenPayload {
  iss: boolean;
  aud: boolean;
  sub: string;
  gid: string;
  cid: number;
  exp: number;
}

export interface AccessTokenPayload extends TokenPayload {
  type: "accessToken";
  isVerified: boolean;
  roles: Roles[];
}
export interface RefreshTokenPayload extends TokenPayload {
  type: "refreshToken";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
