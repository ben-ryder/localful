import {z} from "zod";

export const VaultsURLParams = z.object({
  vaultId: z.string().uuid("vaultId must be a uuid"),
}).strict();

export type VaultsURLParams = z.infer<typeof VaultsURLParams>;
