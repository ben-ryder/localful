import {ConfigService} from "./services/config/config";
import {Logger} from "@nestjs/common";
import {createApp} from "./create-app";


async function bootstrap() {
  const app = await createApp();

  const configService = app.get(ConfigService);
  await app.listen(configService.config.node.port);

  if (configService.config.node.environment !== "production") {
    const logger = new Logger("Local Dev");
    logger.log(`Application available at: http://localhost:${configService.config.node.port}`);
  }
}
bootstrap();
