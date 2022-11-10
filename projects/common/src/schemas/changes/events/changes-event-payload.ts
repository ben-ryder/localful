import {z} from "zod";
import {AddChangesRequest} from "../request/add.changes.request";


export const ChangesEventPayload = z.object({
  userId: z.string(),
  changes: AddChangesRequest
}).strict()

export type ChangesEventPayload = z.infer<typeof ChangesEventPayload>;
