import {injectable, InjectableConfig} from "../../src";
import {CircularService2} from "./circular-service-2";

export class CircularService1 {
    static [injectable]: InjectableConfig = {type: 'singleton', args: [CircularService2]};

    constructor(
        private circularService2: CircularService2,
    ) {}

    getTestValue() {
        return "example1"
    }

    getService2TestValue() {
        return this.circularService2.getTestValue()
    }
}
