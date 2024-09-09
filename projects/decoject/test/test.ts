import {injectable, container, InjectableConfig} from "../build"

class ExampleService {
    static [injectable]: InjectableConfig = {type: 'singleton'}

    constructor() {}

    sayHello() {
        console.log('Hello')
    }
}

class ExampleController {
    static [injectable] = {type: 'singleton', args: [ExampleService]}

    constructor(private exampleService: ExampleService) {}

    sayHello() {
        this.exampleService.sayHello()
    }
}

const controllerInstance = container.use(ExampleController)
controllerInstance.sayHello()