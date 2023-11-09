import {z} from "zod";

export const Entity = z.object({
	id: z.string().uuid('id must be uuid format'),
	createdAt: z.string().datetime({message: "createdAt must be UTC timestamp"}),
	updatedAt: z.string().datetime({message: "updatedAt must be UTC timestamp"}),
}).strict()

export type Entity = z.infer<typeof Entity>;
