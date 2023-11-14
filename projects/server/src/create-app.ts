import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import {NestApplicationOptions, VersioningType} from "@nestjs/common";
import {ErrorFilter} from "./services/errors/error.filter.js";
import {ConfigService} from "./services/config/config.js";


export async function createApp(options?: NestApplicationOptions) {
  const app = await NestFactory.create(AppModule, options || {});
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors({
    origin: configService.config.app.allowedOrigins
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ErrorFilter());

  return app
}
