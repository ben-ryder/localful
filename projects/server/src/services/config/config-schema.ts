import {z} from "zod";

/**
 * The schema of the configuration object of the application.
 * This is exposed via the ConfigService instance attribute ".config").
 */
export const ConfigSchema = z.object({
  general: z.object({
    applicationName: z.string(),
    port: z.number(),
    environment: z.string()
  }),
  app: z.object({
    registrationEnabled: z.boolean(),
    allowedOrigins: z.array(z.string().url())
  }),
  database: z.object({
    url: z.string()
  }),
  dataStore: z.object({
    redisUrl: z.string()
  }),
  auth: z.object({
    issuer: z.string().optional(),
    audience: z.string().optional(),
    accessToken: z.object({
      secret: z.string(),
      expiry: z.string()
    }),
    refreshToken: z.object({
      secret: z.string(),
      expiry: z.string()
    }),
    emailVerification: z.object({
      secret: z.string(),
      url: z.string().url(),
      expiry: z.string()
    }),
    passwordReset: z.object({
      secret: z.string(),
      url: z.string().url(),
      expiry: z.string()
    })
  }),
  email: z.object({
    sendMode: z.union([
        z.literal("mailgun"), z.literal("log"), z.literal("silent")
    ]),
    mailgun: z.object({
      domain: z.string(),
      apiKey: z.string(),
      sender: z.object({
        name: z.string(),
        address: z.string()
      }),
      isEu: z.boolean().optional(),
    })
  }),
});

export type ConfigSchema = z.infer<typeof ConfigSchema>;
