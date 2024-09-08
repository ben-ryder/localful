import configService from "@services/config/config.service.js";
import {createServer} from "./create-server.js";

async function bootstrap() {
  const server = await createServer()

  server.listen(configService.config.general.port);

  if (configService.config.general.environment !== "production") {
    console.log(`Server available at: http://localhost:${configService.config.general.port}`);
  }
}
bootstrap();
