/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {Change} from "./changes.js";

export type ChangeEvent = (changes: Change[]) => void

export interface ChangesEvents {
	changes: ChangeEvent
}
