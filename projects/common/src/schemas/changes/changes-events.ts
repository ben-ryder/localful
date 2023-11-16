/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {ChangesDto} from "./changes.js";

export type ChangeEvent = (changes: ChangesDto) => void

export interface ChangesEvents {
	changes: ChangeEvent
}
