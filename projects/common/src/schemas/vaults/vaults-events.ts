/**
 * Defines events to be used with socket.io Typescript support:
 * https://socket.io/docs/v4/typescript/
 */

import {EntityEvent, EntityIdPayload} from "../common/events";
import {VaultDto} from "./vaults";

export interface VaultsEvents {
	'vaults:create': EntityEvent<VaultDto>,
	'vaults:update': EntityEvent<VaultDto>,
	'vaults:delete': EntityEvent<EntityIdPayload>
}
