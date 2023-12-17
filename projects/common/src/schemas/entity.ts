import {z} from "zod";
import {IdField} from "./common/fields";

export const Entity = z.object({
	id: IdField,
	createdAt: z.string().datetime({message: "createdAt must be UTC timestamp"}),
}).strict()
export type Entity = z.infer<typeof Entity>;


export const EntityUpdatable = Entity.extend({
	updatedAt: z.string().datetime({message: "updatedAt must be UTC timestamp"}),
})
export type EntityUpdatable = z.infer<typeof EntityUpdatable>;
