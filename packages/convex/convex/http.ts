import type { UserDeletedJSON, UserJSON, WebhookEvent } from "@clerk/backend";
import { GenericActionCtx, httpRouter } from "convex/server";
import { Webhook } from "svix";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
    const headers = {
      "svix-id": request.headers.get("svix-id")!,
      "svix-timestamp": request.headers.get("svix-timestamp")!,
      "svix-signature": request.headers.get("svix-signature")!,
    };

    const rawBody = await request.text();
    const event = webhook.verify(rawBody, headers) as WebhookEvent;

    switch (event.type) {
      case "user.created":
        await handleUserCreated(ctx, event.data);
        break;
      case "user.updated":
        await handleUserUpdated(ctx, event.data);
        break;
      case "user.deleted":
        await handleUserDeleted(ctx, event.data);
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;

async function handleUserCreated(ctx: GenericActionCtx<any>, data: UserJSON) {
  // Check user exists with email address
  const existing = await ctx.runQuery(api.users.queries.findOne, {
    where: {
      key: "email",
      value: data.email_addresses[0].email_address,
      operator: "eq",
    },
  });

  if (existing) {
    // check if user is soft deleted
    if (existing.deleted_at) {
      // remove soft delete
      await ctx.runMutation(api.users.mutations.update, {
        id: existing._id,
        data: { deleted_at: "" },
      });
    }

    return;
  }

  // Create user
  const userId = await ctx.runMutation(api.users.mutations.create, {
    auth_provider_id: data.id,
    email: data.email_addresses[0].email_address,
    display_name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
  });

  // Create personal workspace
  const workspaceId = await ctx.runMutation(api.workspaces.mutations.create, {
    name: `${data.first_name ?? "My"}'s Workspace`,
    owner_user_id: userId,
  });

  // Create workspace member
  await ctx.runMutation(api.workspaceMembers.mutations.create, {
    workspace_id: workspaceId,
    user_id: userId,
    role: "owner",
  });

  // TODO: Send welcome email to user
}

async function handleUserUpdated(ctx: GenericActionCtx<any>, data: UserJSON) {
  // Check user exists with email address
  const user = await ctx.runQuery(api.users.queries.findOne, {
    where: {
      key: "email",
      value: data.email_addresses[0].email_address,
      operator: "eq",
    },
  });

  if (!user) {
    return;
  }

  // Update user
  await ctx.runMutation(api.users.mutations.update, {
    id: user._id,
    data: {
      display_name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
    },
  });
}

async function handleUserDeleted(
  ctx: GenericActionCtx<any>,
  data: UserDeletedJSON,
) {
  // Check user exists by auth_provider_id
  const user = await ctx.runQuery(api.users.queries.findOne, {
    where: {
      key: "auth_provider_id",
      value: data.id,
      operator: "eq",
    },
  });

  if (!user) {
    return;
  }

  // Soft delete user
  await ctx.runMutation(api.users.mutations.update, {
    id: user._id,
    data: { deleted_at: new Date().toISOString() },
  });
}
