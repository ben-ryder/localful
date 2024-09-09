import {injectable, InjectableConfig} from "./injectable.js";

/**
 * An interface for something that is instantiable.
 */
export interface Instantiable<T> {
    new(...args: any[]): T;
}

/**
 * The interface for a single dependency.
 */
export interface StoredDependency<T> {
    signature: Instantiable<T>,
    instance?: T,
}

/**
 * The interface for the dependency store itself.
 */
export interface DependencyStore {
    [key: symbol]: StoredDependency<any>;
}

/**
 * An IoC container for managing the registration and retrieval of dependencies.
 */
export class DependencyContainer {
    private dependencyStore: DependencyStore = {};

    /**
     * Get the dependency key attached to the metadata if it exists.
     * @param dependency
     */
    private getDependencyKey<T>(dependency: Instantiable<T>): symbol {
        return Symbol.for(dependency.toString())
    }

    /**
     * Get the injectable config attached to the dependency if it exists.
     * @param dependency
     */
    private getDependencyConfig<T>(dependency: Instantiable<T>): InjectableConfig | undefined {
        // @ts-ignore -- injectable can be used here.
        return dependency[injectable]
    }

    /**
     * Check if the container currently has the given dependency.
     * @param dependency
     */
    has<T>(dependency: Instantiable<T>) {
        const dependencyConfig = this.getDependencyConfig(dependency);
        if (!dependencyConfig) {
            throw new Error("You can't check for a dependency that isn't marked as injectable");
        }

        const dependencyKey = this.getDependencyKey(dependency);
        return dependencyKey in this.dependencyStore;
    }

    /**
     * Get an instance of the dependency via the IoC container.
     *
     * This method will register the dependency or retrieve the existing dependency instance depending
     * on the injection type and if an instance already exists.
     *
     * @param dependency
     */
    use<T>(dependency: Instantiable<T>): T {
        const dependencyKey = this.getDependencyKey(dependency);

        // Register the dependency if it doesn't already exist.
        if (!(dependencyKey in this.dependencyStore)) {
            this.register<T>(dependencyKey, dependency);
        }

        return this.getDependency<T>(dependencyKey);
    }

    /**
     * Register the given dependency to the container.
     *
     * For transient dependencies this will just register the signature for instantiation later,
     * and for singleton dependencies this will create the instance now.
     *
     * @param dependencyKey
     * @param dependency
     * @private
     */
    private register<T>(dependencyKey: symbol, dependency: Instantiable<T>) {
        const dependencyConfig = this.getDependencyConfig(dependency);

        if (dependencyConfig?.type === "transient") {
            this.dependencyStore[dependencyKey] = {
                signature: dependency
            };
        }
        else {
            const instance = this.createInstance<T>(dependency);
            this.dependencyStore[dependencyKey] = {
                signature: dependency,
                instance: instance
            };
        }
    }

    /**
     * Return an instance of the stored dependency with the given key.
     *
     * @private
     * @param dependencyKey
     */
    private getDependency<T>(dependencyKey: symbol): T {
        const storedDependency = this.dependencyStore[dependencyKey];

        if (!storedDependency) {
            throw new Error(`Dependency '${String(dependencyKey)}' was requested but not found in the store`);
        }

        if (storedDependency.instance) {
            return storedDependency.instance as T;
        }
        else {
            return this.createInstance(storedDependency.signature);
        }
    }

    /**
     * Return an instance of the given dependency, recursively injecting child dependencies.
     *
     * @param dependency
     * @private
     */
    private createInstance<T>(dependency: Instantiable<T>): T {
        const dependencyConfig = this.getDependencyConfig(dependency);

        if (!dependencyConfig) {
            throw new Error("Attempted to create instance of dependency that isn't marked as injectable");
        }

        const constructorArguments: any[] = []
        if (dependencyConfig.args) {
            for (const constructorArgument of dependencyConfig.args) {

                if (typeof constructorArgument === 'undefined') {
                    throw new Error("Encountered 'undefined' dependency argument, this likely means a dependency has a circular reference which isn't supported");
                }

                const constructorArgumentConfig = this.getDependencyConfig(constructorArgument)

                if (constructorArgumentConfig) {
                    constructorArguments.push(
                        this.use<T>(constructorArgument)
                    );
                    continue;
                }

                constructorArguments.push(constructorArgument);
            }
        }

        return new dependency(...constructorArguments)
    }

    /**
     * Override a given dependency with a new one.
     * This can be used for overriding dependencies for things like testing or custom implementations.
     *
     * // todo: is there a way to make this properly type safe?
     *    so ideally you would only be able to pass a dependencyOverride that matches types with dependency
     *
     * @param dependency
     * @param dependencyOverride
     */
    override<T>(dependency: Instantiable<T>, dependencyOverride: Instantiable<T>) {
        const baseDependencyKey = this.getDependencyKey<T>(dependency);
        const baseDependencyConfig = this.getDependencyConfig<T>(dependency);

        const dependencyOverrideKey = this.getDependencyKey<T>(dependencyOverride);
        const dependencyOverrideConfig = this.getDependencyConfig<T>(dependencyOverride);

        if (!baseDependencyConfig) {
            throw new Error("You can't override a dependency that isn't marked as injectable");
        }
        if (!dependencyOverrideConfig) {
            throw new Error("You can't override a dependency with one that isn't marked as injectable");
        }

        this.register<T>(baseDependencyKey, dependencyOverride);
        this.register<T>(dependencyOverrideKey, dependencyOverride);
    }

    /**
     * Force set the stored instance of a dependency, bypassing all dependency creation & injection logic.
     * This method can only be used with singleton dependencies.
     *
     * @param dependency
     * @param instance
     */
    set<T>(dependency: Instantiable<T>, instance: T) {
        const dependencyKey = this.getDependencyKey<T>(dependency);
        const dependencyConfig = this.getDependencyConfig<T>(dependency);

        if (!dependencyConfig) {
            throw new Error("You can't override a dependency that isn't marked as injectable");
        }
        if (dependencyConfig?.type === "transient") {
            throw new Error("You can't set the instance of a transient dependency, as a new instance will be returned each time.");
        }

        this.dependencyStore[dependencyKey] = {
            signature: dependency,
            instance: instance
        };
    }
}

/**
 * Export a default singleton container that can be used by package consumers.
 */
export const container = new DependencyContainer()
