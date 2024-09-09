import {injectable, InjectableConfig} from "../../src";
import {CircularService1} from "./circular-service-1";

export class CircularService2 {
    static [injectable]: InjectableConfig = {type: 'singleton', args: [CircularService1]};

    constructor(
        private circularService1: CircularService1,
    ) {}

    getTestValue() {
        return "example1"
    }

    getService1TestValue() {
        return this.circularService1.getTestValue()
    }
}
