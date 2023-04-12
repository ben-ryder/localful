import * as dotenv from "dotenv";
dotenv.config();

import { Injectable } from "@nestjs/common";
import {ConfigSchema} from "./config-schema";


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
      allowedOrigins: process.env.APP_ALLOWED_ORIGINS ? process.env.APP_ALLOWED_ORIGINS.split(",") : []
    },
    database: {
      url: process.env.DATABASE_URL,
    },
    auth: {
      issuer: process.env.AUTH_ISSUER,
      audience: process.env.AUTH_AUDIENCE,
      jwksUri: process.env.AUTH_JWKS_URI,
    }
  });
}
