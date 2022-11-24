import {JwtPayload} from "jsonwebtoken";

export interface TokenPayload extends JwtPayload {
  userId: string;
  userIsVerified: boolean;
}

export interface AccessTokenPayload extends TokenPayload {
  type: "accessToken";
}
export interface RefreshTokenPayload extends TokenPayload {
  type: "refreshToken";
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
