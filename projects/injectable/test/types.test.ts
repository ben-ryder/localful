import {describe, expect, test} from "vitest";

import {InjectableConfig, injectable, container} from "../src";


class ExampleSingleton {
    static [injectable]: InjectableConfig = {type: 'singleton'}
}

class ExampleTransient {
    static [injectable] = {type: 'transient'}
}

describe('dependency type tests', () => {
    test('singleton type should work', async () => {
        const exampleSingleton = container.use(ExampleSingleton)
        const exampleSingleton2 = container.use(ExampleSingleton)
        expect(exampleSingleton === exampleSingleton2).toEqual(true)
    })

    test('transient type should work ', async () => {
        const exampleTransient = container.use(ExampleTransient)
        const exampleTransient2 = container.use(ExampleTransient)
        expect(exampleTransient === exampleTransient2).toEqual(false)
    })
})
