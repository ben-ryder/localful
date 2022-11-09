import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
dotenv.config();

/**
 * The interface that the configuration object (and ConfigService instance attribute ".config") adhere to.
 */
export interface ConfigInterface {
  general: {
    port: number;
    environment: string;
    corsOrigins: string[]
  };
  database: {
    url: string;
  };
  auth: {
    jwksEndpoint: string | null;
    audience: string | null;
    issuer: string | null;
    tokenUserIdKey: string | null;
  };
  testing: {
    endpointEnabled: boolean;
    key: string;
  };
}

/**
 * The raw configuration data.
 *
 * This is created separately to ConfigService, so it can be used in other places such as easily creating a
 * custom config service for testing.
 */
export const config: ConfigInterface = Object.freeze({
  general: {
    port: parseInt(process.env.NODE_PORT as string) || 3000,
    environment: process.env.NODE_ENV || "production",
    corsOrigins: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []
  },
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwksEndpoint: process.env.AUTH_JWKS_ENDPOINT || null,
    audience: process.env.AUTH_AUDIENCE || null,
    issuer: process.env.AUTH_ISSUER || null,
    tokenUserIdKey: process.env.AUTH_TOKEN_USER_ID_KEY || null
  },
  testing: {
    endpointEnabled: process.env.TESTTING_ENDPOINT_ENABLED === "true",
    key: process.env.TESTING_ENDPOINT_KEY,
  },
} as ConfigInterface);

/**
 * An injectable class version of the configuration.
 */
@Injectable()
export class ConfigService {
  readonly config: ConfigInterface = config;
}
