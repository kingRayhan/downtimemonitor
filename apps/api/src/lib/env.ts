import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const envSchema = z.object({
  API_BASE_URL: z.string().url("API_BASE_URL must be a valid URL"),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET must be a valid secret"),
  AUTH_CLIENT_URLS: z.string(),
});

export const APP_ENV: z.infer<typeof envSchema> = envSchema.parse(process.env);
