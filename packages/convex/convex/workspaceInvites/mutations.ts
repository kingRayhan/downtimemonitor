import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Public workspace_invites mutations.
 * Generic data operations only (no business logic).
 */

const baseWorkspaceInviteFields = {
  workspace_id: v.id("workspaces"),
  invited_by_user_id: v.id("users"),
  email: v.string(),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.literal("viewer")
  ),
  token: v.string(),
  status: v.union(
    v.literal("pending"),
    v.literal("accepted"),
    v.literal("expired")
  ),
  expires_at: v.optional(v.string()),
} as const;

export const create = mutation({
  args: baseWorkspaceInviteFields,
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("workspace_invites", {
      ...args,
      created_at: now,
      updated_at: now,
    } as any);
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspace_invites"),
    data: v.object({
      status: v.optional(
        v.union(
          v.literal("pending"),
          v.literal("accepted"),
          v.literal("expired")
        )
      ),
      expires_at: v.optional(v.string()),
      deleted_at: v.optional(v.string()),
    }),
  },
  handler: async (ctx, { id, data }) => {
    const patch: Record<string, unknown> = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    await ctx.db.patch(id, patch as any);
    return id;
  },
});

export const remove = mutation({
  args: { id: v.id("workspace_invites") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});
