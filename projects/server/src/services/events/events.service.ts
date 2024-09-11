import {EventMap, EventTypes, ServerEvent} from "@services/events/events.js";

export class EventsService {
    eventTarget: EventTarget;
    
    constructor() {
        this.eventTarget = new EventTarget();
    }

    subscribe<Event extends keyof EventMap>(type: Event, listener: (e: CustomEvent<EventMap[Event]["detail"]>) => void) {
        this.eventTarget.addEventListener(type, listener)
    }

    unsubscribe<Event extends keyof EventMap>(type: Event, listener: (e: CustomEvent<EventMap[Event]["detail"]>) => void) {
        this.eventTarget.removeEventListener(type, listener)
    }

    subscribeAll(listener: (e: CustomEvent<ServerEvent>) => void) {
        for (const event of Object.values(EventTypes)) {
            this.eventTarget.addEventListener(event, listener)
        }
    }

    unsubscribeAll(listener: (e: CustomEvent<ServerEvent>) => void) {
        for (const event of Object.values(EventTypes)) {
            this.eventTarget.removeEventListener(event, listener)
        }
    }
}
