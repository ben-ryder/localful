import {z} from "zod";

export const ResourceListingParams = z.object({
	page: z.number().int()
		.min(1, "page param must be at least 1")
		.optional(),
	limit: z.number().int()
		.min(1, "limit param must be at least 1")
		.optional(),
		// maximum limit values are set by the server itself, so can't be shared validation.
}).strict();
export type ResourceListingParams = z.infer<typeof ResourceListingParams>;
