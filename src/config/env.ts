import { z } from "zod";

/**
 * Runtime-safe environment configuration.
 *
 * Validated at import time — the app will fail fast if any
 * required env var is missing or invalid.
 */
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001/api"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Kycentra"),
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
});

function createEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });

  if (!parsed.success) {
    console.error("❌  Invalid environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export const env = createEnv();
