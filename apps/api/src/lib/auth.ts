import { apiKey } from "@better-auth/api-key";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { organization } from "better-auth/plugins";
import { db } from "../database/db";
import { memberTable, organizationTable } from "../database/schema";
import { APP_ENV } from "./env";

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
  },
  plugins: [apiKey(), organization()],
  trustedOrigins: APP_ENV.AUTH_CLIENT_URLS.split(","),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith("/sign-up")) {
        const session = ctx.context.newSession;

        // create a new organization
        const orgId = await db
          .insert(organizationTable)
          .values({
            id: crypto.randomUUID(),
            name: `${session?.user.name}'s Organization`,
            slug: `${session?.user.name}-organization-${session?.user.id}`,
            createdAt: new Date(),
          })
          .returning({ id: organizationTable.id });

        if (!session?.user.id) {
          throw new Error("User ID is required");
        }

        const memberId = await db
          .insert(memberTable)
          .values({
            id: crypto.randomUUID(),
            organizationId: orgId[0].id,
            userId: session.user.id,
            role: "owner",
            createdAt: new Date(),
          })
          .returning({ id: memberTable.id });

        if (!memberId[0].id) {
          throw new Error("Member ID is required");
        }

        // set the organization id and member id in the session
        await betterAuthServer.api.setActiveOrganization({
          body: { organizationId: orgId[0].id },
          headers: ctx.request?.headers ?? {},
        });
      }
    }),
  },
});

export const auth = betterAuthServer;
