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
    registrationEnabled: z.boolean(),
    allowedOrigins: z.array(z.string().url())
  }),
  database: z.object({
    url: z.string()
  }),
  dataStore: z.object({
    redisUrl: z.string()
  }),
  email: z.object({
    testMode: z.boolean().optional(),
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
    passwordReset: z.object({
      secret: z.string(),
      expiry: z.string()
    }),
    accountVerification: z.object({
      secret: z.string(),
      expiry: z.string()
    })
  })
});

export type ConfigSchema = z.infer<typeof ConfigSchema>;
