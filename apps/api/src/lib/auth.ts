import { betterAuth } from "better-auth";
import { apiKey } from "@better-auth/api-key";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../database/db";
import { APP_ENV } from "./env";

export const betterAuthServer = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: APP_ENV.AUTH_SECRET,
  baseURL: APP_ENV.API_BASE_URL,
  basePath: "/auth",
  emailAndPassword: { enabled: true, autoSignIn: true },
  plugins: [apiKey()],
});

export const auth = betterAuthServer;
