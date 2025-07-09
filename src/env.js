import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string(), // Simplified validation to allow any string format
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    MINIO_ENDPOINT: z.string().trim().min(1),
    MINIO_PORT: z.number().int().positive(),
    MINIO_CLIENT_ACCESS_KEY: z.string().trim().min(1),
    MINIO_CLIENT_SECRET_KEY: z.string().trim().min(1),
    MINIO_USE_SSL: z.boolean().default(false),
    BUCKET_NAME: z.string().trim().min(1),
    REDIS_URL: z.string().url(),
    REDIS_PASSWORD: z.string().trim().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server-side env vars
    DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES_URL, // Add fallback
    NODE_ENV: process.env.NODE_ENV,

    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PORT: parseInt(process.env.MINIO_PORT),
    MINIO_CLIENT_ACCESS_KEY: process.env.MINIO_CLIENT_ACCESS_KEY,
    MINIO_CLIENT_SECRET_KEY: process.env.MINIO_CLIENT_SECRET_KEY,
    MINIO_USE_SSL:
      process.env.MINIO_USE_SSL === "true" || process.env.MINIO_USE_SSL === "1",
    BUCKET_NAME: process.env.BUCKET_NAME,
    // Client-side env vars
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation:
    process.env.NODE_ENV === "production" || !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
