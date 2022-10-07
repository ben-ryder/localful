import {ConfigService} from "../../services/config/config";
import {Controller, Get} from "@nestjs/common";
import {InfoDto} from "../../common/schemas/info/dtos/info.dto";


@Controller({
  version: "1",
  path: "/info"
})
export class InfoController {
  constructor(
    private configService: ConfigService
  ) {}

  @Get()
  async getInfo() {
    const meta: InfoDto = {
      version: "v1",
      registrationEnabled: this.configService.config.app.registrationEnabled
    }

    return meta;
  }
}
