import {z} from "zod";

export const IdField = z.string().uuid('id field must be a uuid')

export const ProtectedDataField = z.string()
	.min(1, 'protectedData field must not be empty')
