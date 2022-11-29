import * as dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import {ConfigSchema} from "./config-schema";
dotenv.config();

/**
 * A class containing configuration for use across the application.
 *
 * Although configuration is basically just a plain object its wrapped in this class to allow it
 * to be used in the NestJS DI system.
 * The config uses a zod schema, so it will throw an error if the config doesn't follow the schema.
 */
@Injectable()
export class ConfigService {
  readonly config: ConfigSchema = ConfigSchema.parse({
    general: {
      port: parseInt(process.env.NODE_PORT as string) || 3000,
      environment: process.env.NODE_ENV || "production"
    },
    app: {
      registrationEnabled: process.env.APP_REGISTRATION_ENABLED === "true",
      allowedOrigins: process.env.APP_ALLOWED_ORIGINS ? process.env.APP_ALLOWED_ORIGINS.split(",") : []
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    dataStore: {
      redisUrl: process.env.DATA_STORE_REDIS_URL
    },
    auth: {
      issuer: process.env.AUTH_ISSUER || null,
      audience: process.env.AUTH_AUDIENCE || null,
      accessToken: {
        secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
        expiry: "15 mins",
      },
      refreshToken: {
        secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
        expiry: "7 days"
      },
      passwordReset: {
        secret: process.env.AUTH_PASSWORD_RESET_SECRET,
        expiry: "15 mins"
      },
      accountVerification: {
        secret: process.env.AUTH_ACCOUNT_VERIFICATION_SECRET,
        expiry: "15 mins"
      }
    }
  });
}
