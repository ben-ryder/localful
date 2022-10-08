import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {NestApplicationOptions, VersioningType} from "@nestjs/common";
import {ErrorFilter} from "./common/errors/error.filter";


export async function createApp(options?: NestApplicationOptions) {
  const app = await NestFactory.create(AppModule, options || {});

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new ErrorFilter());

  return app
}
