// JSON type from https://github.com/colinhacks/zod#json-type
import {z} from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;

export type JSONData = Literal | { [key: string]: JSONData } | JSONData[];

export const JSONData: z.ZodType<JSONData> = z.lazy(() =>
  z.union([literalSchema, z.array(JSONData), z.record(JSONData)])
);
