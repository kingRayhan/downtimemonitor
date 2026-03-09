import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // TODO: Verify Clerk signature using CLERK_WEBHOOK_SECRET.

    const payload = (await request.json()) as any;
    const type = payload?.type as string | undefined;
    const data = payload?.data as any;

    if (!type || !data) {
      return new Response("Invalid Clerk payload", { status: 400 });
    }

    const clerkUserId = data.id as string | undefined;
    if (!clerkUserId) {
      return new Response("Missing user id", { status: 400 });
    }

    const emailAddresses = (data.email_addresses ?? []) as {
      id: string;
      email_address: string;
    }[];
    const primaryEmailId = data.primary_email_id as string | undefined;
    const primaryEmailEntry =
      emailAddresses.find((e) => e.id === primaryEmailId) ?? emailAddresses[0];
    const primaryEmail = primaryEmailEntry?.email_address ?? "";

    const displayName =
      (data.username as string | undefined) ||
      [data.first_name, data.last_name].filter(Boolean).join(" ") ||
      primaryEmail;

    const now = new Date().toISOString();

    const existing = await ctx.runQuery(api.users.queries.findOne, {
      where: {
        key: "clerk_user_id",
        value: clerkUserId,
        operator: "eq",
      },
    });

    // Soft-delete on user.deleted
    if (type === "user.deleted") {
      if (existing) {
        await ctx.runMutation(api.users.mutations.update, {
          id: existing._id,
          data: {
            deleted_at: now,
          },
        });
      }
      return new Response(null, { status: 200 });
    }

    // Upsert on created/updated events
    if (!existing) {
      await ctx.runMutation(api.users.mutations.create, {
        clerk_user_id: clerkUserId,
        primary_email: primaryEmail,
        display_name: displayName,
      });
    } else {
      await ctx.runMutation(api.users.mutations.update, {
        id: existing._id,
        data: {
          primary_email: primaryEmail,
          display_name: displayName,
        },
      });
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
