
export const injectable = Symbol()

export type InjectableConfig = {
    type: 'singleton' | 'transient'
    args?: any[]
}
