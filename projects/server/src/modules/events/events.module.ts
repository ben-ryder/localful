import {forwardRef, Module} from "@nestjs/common";
import { EventsGateway } from "./events.gateway";
import {AuthModule} from "../auth/auth.module";
import {ServicesModule} from "../../services/services.module";


@Module({
    imports: [ServicesModule, forwardRef(() => AuthModule)],
    controllers: [],
    providers: [EventsGateway],
    exports: []
})
export class EventsModule {}
