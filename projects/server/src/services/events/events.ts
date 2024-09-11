
export const EventTypes = {
    // User Events
    USER_CHANGE: "user-change",
    // Vaults Events
    VAULT_CHANGE: "vault-change",
} as const

export interface UserChangeEvent {
    type: typeof EventTypes.USER_CHANGE,
    detail: {
        id: string,
        ownerId: string,
        action: "create" | "update" | "delete" | "purge"
    }
}

export interface VaultChangeEvent {
    type: typeof EventTypes.VAULT_CHANGE,
    detail: {
        id: string,
        ownerId: string,
        action: "create" | "update" | "delete" | "purge"
    }
}

export interface EventMap {
    [EventTypes.USER_CHANGE]: UserChangeEvent,
    [EventTypes.VAULT_CHANGE]: VaultChangeEvent,
}

export type ServerEvent = UserChangeEvent | VaultChangeEvent
export type EventTypes = keyof EventMap
