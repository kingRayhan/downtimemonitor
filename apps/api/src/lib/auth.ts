import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { db } from "../database/db";
import { APP_ENV } from "./env";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const betterAuthServer = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: APP_ENV.AUTH_SECRET,
  baseURL: APP_ENV.API_BASE_URL,
  basePath: "/auth",
  emailAndPassword: { enabled: true, autoSignIn: true },
  socialProviders: {
    github: {
      enabled: true,
      clientId: "github_client_id",
      clientSecret: "github_client_secret",
    },
    google: {
      enabled: true,
      clientId: APP_ENV.GOOGLE_CLIENT_ID,
      clientSecret: APP_ENV.GOOGLE_CLIENT_SECRET,
      redirectURI: `${APP_ENV.API_BASE_URL}/auth/callback/google`,
    },
  },
  plugins: [apiKey(), organization()],
  trustedOrigins: APP_ENV.AUTH_CLIENT_URLS.split(","),
});

export const auth = betterAuthServer;
