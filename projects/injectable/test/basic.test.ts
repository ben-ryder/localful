import {describe, expect, test} from "vitest";

import {InjectableConfig, injectable, DependencyContainer, container} from "../src";


class ExampleService {
    static [injectable]: InjectableConfig = {type: 'singleton'}

    constructor() {}

    getTestValue() {
        return "example"
    }
}

class ExampleController {
    static [injectable] = {type: 'singleton', args: [ExampleService]}

    constructor(private exampleService: ExampleService) {}

    getTestValue() {
        return this.exampleService.getTestValue()
    }
}

describe('basic usage tests', () => {
    test('package container should work ', async () => {
        const controllerInstance = container.use(ExampleController)
        expect(controllerInstance.getTestValue()).toEqual("example")
    })

    test('custom container should work ', async () => {
        const customContainer = new DependencyContainer()
        const controllerInstance = customContainer.use(ExampleController)
        expect(controllerInstance.getTestValue()).toEqual("example")
    })
})
