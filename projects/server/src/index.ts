import {ConfigService} from "@services/config/config.service.js";
import {createServer} from "./create-server.js";
import {container} from "./di-container.js";

async function bootstrap() {
  console.debug("[Server] Starting server")
  const server = await createServer()
  const configService = container.resolve<ConfigService>(ConfigService);

  server.listen(configService.config.general.port);
  console.log(`[Server] Listening at http://localhost:${configService.config.general.port}`);
}
bootstrap();
