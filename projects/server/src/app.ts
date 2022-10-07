import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {NestApplicationOptions, VersioningType} from "@nestjs/common";


export async function createApp(options?: NestApplicationOptions) {
  const app = await NestFactory.create(AppModule, options || {});

  app.enableVersioning({
    type: VersioningType.URI,
  });

  return app
}
