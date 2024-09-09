import {describe, expect, test} from "vitest";

import {InjectableConfig, injectable, container} from "../src";
import {CircularService1} from "./classes/circular-service-1";
import {CircularService2} from "./classes/circular-service-2";


class ExampleController {
    static [injectable]: InjectableConfig = {type: 'singleton', args: [CircularService1, CircularService2]}

    constructor(
        private circularService1: CircularService1,
        private circularService2: CircularService2
    ) {}

    getTestValue() {
        return this.circularService1.getTestValue() + "-" + this.circularService2.getTestValue()
    }
}

describe('circular dependency testing', () => {
    test('attempting to load dependencies that inject each other should throw an error', async () => {
        expect(() => container.use(ExampleController)).toThrowError("dependency has a circular reference")
    })
})
