import {EventsService} from "@services/events/events.service.js";
import {RequestUser} from "@common/request-context.js";
import ms from "ms";
import crypto from "node:crypto";
import {DataStoreService} from "@services/data-store/data-store.service.js";
import {AccessUnauthorizedError} from "@services/errors/access/access-unauthorized.error.js";
import {ErrorIdentifiers} from "@localful/common";
import {SystemError} from "@services/errors/base/system.error.js";
import {z} from "zod";
import {VaultsDatabaseService} from "@modules/vaults/database/vaults.database.service.js";
import {AccessForbiddenError} from "@services/errors/access/access-forbidden.error.js";

// Actions which are sent by the sync service to the websocket controller.
// The websocket controller stores sockets and rooms, but relies on the service for all logic.
export type SyncAction = {
    type: "send-event", rooms: string[], event: any
} | {
    type: "disconnect-session", sessionId: string
} | {
    type: "disconnect-user", userId: string
} | {
    type: "delete-rooms", rooms: string[]
}


export type SyncActionCallback = (action: SyncAction) => Promise<void>

export interface ConnectionData {
    sessionId: string
    userId: string
    expiry: number
}

export interface InitialConnection {
    connectionData: ConnectionData
    rooms: string[]
}

export const ConnectionTicketData = z.object({
    userId: z.string().uuid(),
    sessionId: z.string().uuid(),
    connectionExpiry: z.number(),
    ticketExpiry: z.number()
}).strict()
export type ConnectionTicketData = z.infer<typeof ConnectionTicketData>


export class SyncService {
    #actionCallback: SyncActionCallback | null = null

    constructor(
        private readonly eventService: EventsService,
        private readonly dataStoreService: DataStoreService,
        private readonly vaultsDatabaseService: VaultsDatabaseService,
    ) {}

    registerActionCallback(callback: (action: SyncAction) => Promise<void>) {
        this.#actionCallback = callback
    }

    async requestTicket(requestUser: RequestUser): Promise<string> {
        // todo: validate that request user has permissions and is verified.

        const ticketExpiry = new Date().getTime() + ms("15m"); // todo: change to 15s after initial testing
        const connectionExpiry = new Date().getTime() + ms("15m");
        const connectionData: ConnectionTicketData = {
            userId: requestUser.id,
            sessionId: requestUser.sessionId,
            // When the connection will expiry and require refreshing
            connectionExpiry: connectionExpiry,
            // When the provided token will expire and no longer be usable to open a websocket connection
            ticketExpiry: ticketExpiry
        }
        const connectionTicket = crypto.randomBytes(16).toString("base64");

        await this.dataStoreService.addItem(connectionTicket, JSON.stringify(connectionData), {epochExpiry: ticketExpiry});

        return connectionTicket
    }

    /**
     * Validate that the supplied connection ticket is valid.
     * Will return a list of rooms that the user should join if valid, and throw an error if not.
     *
     * @param connectionTicket
     * @param existingConnection
     */
    async validateTicket(connectionTicket: string, existingConnection?: ConnectionData): Promise<InitialConnection> {
        const item = await this.dataStoreService.getItem(connectionTicket);
        if (!item) {
            throw new AccessUnauthorizedError({identifier: ErrorIdentifiers.REQUEST_INVALID, message: "No matching connection ticket found"})
        }

        // todo: add ability to save/load json data to data store
        const parsedData = ConnectionTicketData.safeParse(item);
        if (!parsedData.success) {
            throw new SystemError({message: "Saved connection ticket data"})
        }
        const ticketData = parsedData.data

        // Validate that this is a valid token for an existing connection
        if (existingConnection) {
            if (existingConnection.sessionId !== ticketData.sessionId || existingConnection.userId !== ticketData.userId) {
                // todo: custom error identifier/message in this situation?
                throw new AccessUnauthorizedError({identifier: ErrorIdentifiers.REQUEST_INVALID, message: "No matching connection ticket found"})
            }
        }

        // todo: setup connection expiry and refresh mechanic at this point? or pass to websocket controller to do?

        return {
            connectionData: {
                userId: ticketData.userId,
                sessionId: ticketData.sessionId,
                expiry: ticketData.connectionExpiry,
            },
            // The connection should automatically join the room for its current user
            rooms: [`user-${ticketData.userId}`]
        }
    }

    async requestSubscriptions(userId: string, vaults: string[]): Promise<string[]> {
        for (const vaultId of vaults) {
            // todo: should this be done via the AccessControlService? can't be right now as doesn't have full RequestUser details
            const vault = await this.vaultsDatabaseService.get(vaultId)
            if (vault.ownerId !== userId) {
                throw new AccessForbiddenError({
                    applicationMessage: "You do not have the permissions required to perform this action."
                });
            }
        }

        return vaults.map(vaultId => `vault-${vaultId}`)
    }

    async sendAction(action: SyncAction): Promise<void> {
        if (!this.#actionCallback) {
            throw new SystemError({message: "Attempted to send sync service action but not callback has been registered. This should have been done by the websocket controller."})
        }
        await this.#actionCallback(action)
    }
}
