import {ConfigService} from "../../services/config/config";
import {Controller, Get} from "@nestjs/common";
import {ServerInfoDto} from "@localful/common";


@Controller({
  path: "/info"
})
export class InfoController {
  constructor(
    private configService: ConfigService
  ) {}

  @Get()
  async getInfo() {
    const meta: ServerInfoDto = {
      version: "v1",
      registrationEnabled: this.configService.config.app.registrationEnabled,
      limits: {
        vaultsPerUser: 10,
        // todo: review if/how to implement these size limits.
        contentSize: 20,
        vaultSize: 1000,
      }
    }

    return meta;
  }
}
