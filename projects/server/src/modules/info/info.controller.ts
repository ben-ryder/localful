import {ConfigService} from "../../services/config/config";
import {Controller, Get} from "@nestjs/common";
import {InfoDto} from "@localful/common";


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
      version: "v1"
    }

    return meta;
  }
}
