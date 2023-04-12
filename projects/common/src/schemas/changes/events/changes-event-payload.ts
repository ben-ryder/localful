import {z} from "zod";
import {ChangeCreateDto} from "../crud/change.create.dto";

export const ChangesEventPayload = ChangeCreateDto;
export type ChangesEventPayload = z.infer<typeof ChangesEventPayload>;
