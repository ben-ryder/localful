import {ConfigService} from "@services/config/config.service.js";
import {createServer} from "./create-server.js";
import {container} from "@ben-ryder/injectable";

async function bootstrap() {
  console.debug("[Server] Starting server")
  const server = await createServer()
  const configService = container.use(ConfigService);

  server.listen(configService.config.general.port);
  console.log(`[Server] Listening at http://localhost:${configService.config.general.port}`);
}
bootstrap();
