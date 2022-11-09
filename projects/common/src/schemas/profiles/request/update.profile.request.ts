import {z} from "zod";

// JSON type from https://github.com/colinhacks/zod#json-type
const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export const UpdateProfileRequest = z.array(
  z.object({
    data: jsonSchema
  }).strict()
)
export type UpdateProfileRequest = z.infer<typeof UpdateProfileRequest>;
