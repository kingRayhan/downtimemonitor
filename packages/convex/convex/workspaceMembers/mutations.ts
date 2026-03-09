import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Public workspace_members mutations.
 * Generic data operations only (no business logic).
 */

const baseWorkspaceMemberFields = {
  workspace_id: v.id("workspaces"),
  user_id: v.id("users"),
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.literal("viewer")
  ),
  invited_by_user_id: v.optional(v.id("users")),
  invited_at: v.optional(v.string()),
  accepted_at: v.optional(v.string()),
} as const;

export const create = mutation({
  args: baseWorkspaceMemberFields,
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("workspace_members", {
      ...args,
      created_at: now,
      updated_at: now,
      deleted_at: null,
    } as any);
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspace_members"),
    data: v.object({
      role: v.optional(
        v.union(
          v.literal("owner"),
          v.literal("admin"),
          v.literal("member"),
          v.literal("viewer")
        )
      ),
      invited_by_user_id: v.optional(v.id("users")),
      invited_at: v.optional(v.string()),
      accepted_at: v.optional(v.string()),
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
  args: { id: v.id("workspace_members") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

