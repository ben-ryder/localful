import {EventMap, EventIdentifiers, ServerEvent} from "@services/events/events.js";

export class EventsService {
    eventTarget: EventTarget;
    
    constructor() {
        this.eventTarget = new EventTarget();
    }

    async dispatch(event: ServerEvent) {
        const customEvent = new CustomEvent(event.type, {detail: event.detail})
        this.eventTarget.dispatchEvent(customEvent)
    }

    subscribe<Event extends keyof EventMap>(type: Event, listener: (e: CustomEvent<EventMap[Event]["detail"]>) => void) {
        this.eventTarget.addEventListener(type, listener)
    }

    unsubscribe<Event extends keyof EventMap>(type: Event, listener: (e: CustomEvent<EventMap[Event]["detail"]>) => void) {
        this.eventTarget.removeEventListener(type, listener)
    }

    subscribeAll(listener: (e: CustomEvent<ServerEvent>) => void) {
        for (const event of Object.values(EventIdentifiers)) {
            this.eventTarget.addEventListener(event, listener)
        }
    }

    unsubscribeAll(listener: (e: CustomEvent<ServerEvent>) => void) {
        for (const event of Object.values(EventIdentifiers)) {
            this.eventTarget.removeEventListener(event, listener)
        }
    }
}
