
export interface EntityIdPayload {
	id: string
}

export type EntityEvent<T> = () => T
