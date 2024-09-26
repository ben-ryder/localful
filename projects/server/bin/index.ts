import {Application} from "../src/application.js";
import {ConfigService} from "@services/config/config.service.js";


async function bootstrap() {
  console.debug("[Server] Starting server")
  const application = new Application()
  const server = await application.init()

  const configService = application.getDependency<ConfigService>(ConfigService);
  server.listen(configService.config.general.port, () => {
    console.log(`[Server] Listening on port ${configService.config.general.port}`);
  });
}
bootstrap();
