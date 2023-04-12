import {z} from "zod";

/**
 * The schema of the configuration object of the application.
 * This is exposed via the ConfigService instance attribute ".config").
 */
export const ConfigSchema = z.object({
  general: z.object({
    port: z.number(),
    environment: z.string()
  }),
  app: z.object({
    allowedOrigins: z.array(z.string().url())
  }),
  database: z.object({
    url: z.string()
  }),
  auth: z.object({
    issuer: z.string(),
    audience: z.string(),
    jwksUri: z.string()
  })
});

export type ConfigSchema = z.infer<typeof ConfigSchema>;
