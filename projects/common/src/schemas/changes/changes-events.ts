/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {ResourceChangesDto} from "./changes";

export type ChangeEvent = (changes: ResourceChangesDto) => void

export interface ChangesEvents {
	changes: ChangeEvent
}
