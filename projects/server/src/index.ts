import "reflect-metadata";

import {ConfigService} from "@services/config/config.service.js";
import {createServer} from "./create-server.js";
import container from "@common/injection/container.js";

async function bootstrap() {
  const server = await createServer()
  const configService = container.use(ConfigService);

  server.listen(configService.config.general.port);

  if (configService.config.general.environment !== "production") {
    console.log(`Server available at: http://localhost:${configService.config.general.port}`);
  }
}
bootstrap();
