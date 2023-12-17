
export interface EntityEventPayload {
	id: string
}

export type EntityEvent = () => EntityEventPayload
