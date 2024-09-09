# @ben-ryder/injectable

A minimal constructor-based dependency injection library for typescript and javascript without using decorators.

## Why?
I recently wanted to add dependency injection (DI) to an Express.js project but couldn't find any DI
libraries that worked how I wanted.  
Lots of good library use decorators for DI such as [TypeDI](https://github.com/typestack/typedi) and
[InversifyJS](https://github.com/inversify/InversifyJS), and while in an ideal world I'd love to use decorators, I couldn't get
any of these libraries to place nice while also using ESM and tools like [Jest](https://github.com/jestjs/jestvites), [Vitest](https://github.com/vitest-dev/vitest), [tsx](https://www.npmjs.com/package/tsx) etc.  
I concluded that my sanity was more valuable than using decorators, and although I then found some other great DI
libraries that didn't use decorators such as [PumpIt](https://github.com/ivandotv/pumpit), nothing worked quite how
I wanted.  
`@ben-ryder/injectable` is the simple DI library without decorators that I wanted to find, built to fulfill my own
needs but also for learning... and fun I guess.

## Installation

```bash
npm install @ben-ryder/injectable
```

## Usage

Using this package you can mark a dependency as injectable by setting the `[injectable]` static property and then retrieve an
instance of a dependency with `container.use(...)`. Here is a basic example of this in practice:

```ts
import {injectable, container, InjectableConfig} from "@ben-ryder/decoject"

// 1. Mark a class as injectable
class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}

    async sayHello() {
        console.log("Hello!")
    }
}

// 2. Define the dependencies you wish to inject into the constructor
class ExampleController {
    static [injectable]: InjectableConfig = {type: "singleton", args: [ExampleService]}
    
    constructor(
        private readonly exampleService: ExampleService
    ) {}

    async sayHello() {
        this.exampleService.sayHello()
    }
}

// 3. Retrieve an instance of your class via the DI container. All dependencies will automatically be injected.
const exampleController = container.use(ExampleController)
exampleController.sayHello() // prints "Hello!"
```
`injectable` is a symbol exposed by the package and is used to ensure there is no conflict with properties/methods
on the given dependency.  
This static property does the job that decorators do in decorator-based DI systems, which is associating DI metadata with the given class so this can be used later by the container when resolving dependencies.

You define the dependencies to inject by using the `args` array on the injectable property. These arguments will be resolved and passed to the constructor of your dependency at instantiation.
It's recommended to only pass other dependencies marked as injectable as arguments, however in theory it's possible to pass through anything.  
If you're having issues instantiating a dependency with special argument requirements, consider trying `container.set` (detailed below) to explicitly set up the container instance. 

The container will inject all dependencies recursively, so for example you could have a dependency structure like `UserController -> UserService -> UserDatabaseService -> DatabaseService`.  
Just remember that all dependencies must be marked as injectable for the container to resolve them, and you **can't have circular dependencies** as that creates a black hole.  

❤️ Thanks to the [PumpIt](https://github.com/ivandotv/pumpit) package which inspired my use of the `injectable` symbol and `args` list.

## Reference

### `container.use()`
Return an instance of the given dependency, recursively resolving its dependencies too:

```ts
import {injectable, container, InjectableConfig} from "@ben-ryder/decoject"

class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello!")
    }
}

const exampleService = container.use(ExampleService)
exampleService.sayHello() // prints "Hello!"
```

### `container.has()`
Return a boolean indicating if the container has an instance of the given dependency:

```ts
import {injectable, container, InjectableConfig} from "@ben-ryder/decoject"

class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello!")
    }
}

container.has(ExampleService) // false

const exampleService = container.use(ExampleService)
container.has(ExampleService) // true
```

### `container.set()`
This method lets you explicitly set the instance of a dependency, which can be useful in situations where a dependency
has some custom setup requirements that the container can't automatically handle.  
This won't work for dependencies with the `transient` type.

```ts
import {injectable, container, InjectableConfig} from "@ben-ryder/decoject"

interface ExampleServiceConfig {
    name: string
}

class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}
    config: ExampleServiceConfig
    
    constructor(config: ExampleServiceConfig) {
        this.config = config
    }

    async sayHello() {
        console.log(`Hello ${this.config.name}!`)
    }
}

// container.override()
const instance = new ExampleService({name: "world"})
container.set(ExampleService, exampleInstance)

const exampleService = container.use(ExampleService)
exampleController.sayHello() // prints "Hello world!"
instance === exampleService // true
```

### `container.override()`
This method lets you override one dependency with another, this can be useful in situations where you want to inject a mock or similar
and could also be combined with using a custom container instance:

```ts
import {injectable, container, DependencyContainer, InjectableConfig} from "@ben-ryder/decoject"

class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello!")
    }
}

class ExampleServiceMock {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello this is the mock!")
    }
}

const customContainer = new DependencyContainer()
customContainer.override(ExampleService, ExampleServiceMock)

const exampleService = container.use(ExampleService)
exampleSercice.sayHello() // prints "Hello this is the mock!"
```

### Singleton and transient dependencies
You must always define the dependency type which will be either `singleton` or `transient`.  
A singleton means a single instance will be created and shared for every `container.use()` call and `transient` means a
new instance will be returned for every `container.use()` call.  
Note that if a transient dependency depends on a singleton, that singleton will still be the same shared instance and not
a new instance.

```ts
import {injectable, container, InjectableConfig} from "@ben-ryder/decoject"

class ExampleSingleton {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello!")
    }
}

class ExampleTransient {
    static [injectable]: InjectableConfig = {type: "transient"}

    async sayHello() {
        console.log("Hello!")
    }
}

const exampleSingleton = container.use(ExampleSingleton)
const exampleSingleton2 = container.use(ExampleSingleton)
exampleSingleton === exampleSingleton2 // true

const exampleTransient = container.use(ExampleTransient)
const exampleTransient2 = container.use(ExampleTransient)
exampleTransient === exampleTransient2 // false

```

### Custom container instance
You may wish to have direct control over the container, for example if you are writing tests and don't want to rely on the container exposed by the package:

```ts
import {injectable, container, InjectableConfig, DependencyContainer} from "@ben-ryder/decoject"

const customContainer = new DependencyContainer()

class ExampleService {
    static [injectable]: InjectableConfig = {type: "singleton"}
    
    async sayHello() {
        console.log("Hello!")
    }
}

const exampleService = customContainer.use(ExampleService)
exampleController.sayHello()
```
