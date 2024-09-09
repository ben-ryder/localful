# @ben-ryder/decoject

A minimal dependency injection system using Decorators.

## Installation

1. Install the package and reflect-metadata so we can use decorators:
```bash
npm install @ben-ryder/decoject reflect-metadata
```

2. Import reflect-metadata once and as early as possible in you application, for example at the entry point:
```bash
import "reflect-metadata"
```

3. Ensure your `tsconfig.json` file is configured to support decorators:
```json5
{
  "compilerOptions": {
    // Ensure these two options are set to true
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
  }
}
```

## Usage

Using this package you can mark a dependency as injectable using the `@Injectable()` decorator and then retrieve an
instance of this dependency with `container.use(...)`. The container will handle recursively resolving any other injectable dependencies. 

Here is a basic example of this in practice:

```ts
import {Injectable, container} from "@ben-ryder/decoject"

// 1. Mark a class as injectable using the decorator
@Injectable()
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}

// 2. Define the dependencies you wish to inject in the constructor. Note that the class you want to inject into must also be marked with @Injectable()
@Injectable()
class ExampleController {
    constructor(
        private readonly exampleService: ExampleService
    ) {}

    async sayHello() {
        this.exampleService.sayHello()
    }
}

// 3. Retrieve an instance of your class via the DI container. The dependencies will autoamtically be injected.
const exampleController = container.use(ExampleController)
exampleController.sayHello() // prints "Hello!"
```

### Advanced Usage

#### `container.has()`
Return a boolean indicating if the container has an instance of the given dependency:

```ts
import {Injectable, container} from "@ben-ryder/decoject"

@Injectable()
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}

container.has(ExampleService) // false

const exampleService = container.use(ExampleService)
container.has(ExampleService) // true
```

#### `container.set()`
This method lets you explicitly set the instance of a dependency, which can be useful in situations where a dependency
has some custom setup requirements that the container can't handle.  
This won't work for dependencies that are marked as unique.

```ts
import {Injectable, container} from "@ben-ryder/decoject"

interface ExampleServiceConfig {
    name: string
}

@Injectable()
class ExampleService {
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

#### `container.override()`
This method lets you override one dependency with another, this can be useful in situations where you want to inject a mock or similar
and could also be combined with using a custom container instance:

```ts
import {DependencyContainer, Injectable, container} from "@ben-ryder/decoject"

@Injectable()
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}

@Injectable()
class ExampleServiceMock {
    async sayHello() {
        console.log("Hello this is the mock!")
    }
}

const customContainer = new DependencyContainer()
customContainer.override(ExampleService, ExampleServiceMock)

const exampleService = container.use(ExampleService)
exampleSercice.sayHello() // prints "Hello this is the mock!"
```

#### Global vs unique dependencies
By default, dependency instances will be global which means that the same instance will always be returned.  
If you wish a new instance to be returned for every `container.use()` call you can set the `injectMode`:

```ts
import {Injectable} from "@ben-ryder/decoject"

@Injectable({
    injectMode: 'unique' // or 'global' (default)
})
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}
```

#### Custom container instance
You may wish to have direct control over the container, for example if you are writing tests and don't want to rely on the container exposed by the package:

```ts
import {DependencyContainer, Injectable} from "@ben-ryder/decoject"

const customContainer = new DependencyContainer()

@Injectable()
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}

const exampleService = customContainer.use(ExampleService)
exampleController.sayHello()
```

#### Custom dependency key
You may explicitly set the dependency key used internally by the container via the injectable decorator.  
You should still reference dependencies via their class (`container.use(ExampleService)`) but this can help with debugging dependencies if something is going wrong.

```ts
import {Injectable} from "@ben-ryder/decoject"

@Injectable({
    key: 'example-service'
})
class ExampleService {
    async sayHello() {
        console.log("Hello!")
    }
}
```
