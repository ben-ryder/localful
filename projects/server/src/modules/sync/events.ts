// todo: move into common package

import {z} from "zod";


export const ClientSentEvent = z.object({
    messageId: z.string().uuid()
}).strict()

export const ClientSubscribeEvent = ClientSentEvent.extend({
    type: z.literal("subscribe"),
    data: z.object({
        vaults: z.array(z.string().uuid())
    })
}).strict()
export type ClientSubscribeEvent = z.infer<typeof ClientSubscribeEvent>


export const ClientTicketEvent = ClientSentEvent.extend({
    type: z.literal("ticket"),
    data: z.object({
        ticket: z.string()
    })
})
export type ClientTicketEvent = z.infer<typeof ClientTicketEvent>

export const ClientSentEvents = z.union([ClientSubscribeEvent, ClientTicketEvent])
export type ClientSentEvents = z.infer<typeof ClientSentEvents>


export const ServerAckEvent = z.object({
    type: z.literal("ack"),
    data: z.object({
        messageId: z.string().uuid()
    })
}).strict()
export type ServerAckEvent = z.infer<typeof ServerAckEvent>

export const ServerRefreshTicketEvent = z.object({
    type: z.literal("refresh-ticket"),
}).strict()
export type ServerRefreshTicketEvent = z.infer<typeof ServerRefreshTicketEvent>

export const ServerErrorEvent = z.object({
    type: z.literal("error"),
    data: z.object({
        messageId: z.string().uuid(),
        identifier: z.string(), // todo: make more specific?
        message: z.string().optional()
    })
}).strict()
export type ServerErrorEvent = z.infer<typeof ServerErrorEvent>

export const ServerSentEvents = z.union([ServerAckEvent, ServerRefreshTicketEvent, ServerErrorEvent])
export type ServerSentEvents = z.infer<typeof ServerSentEvents>
