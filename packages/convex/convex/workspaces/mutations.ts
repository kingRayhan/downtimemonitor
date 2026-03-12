import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Public workspace mutations.
 * Generic data operations only (no business logic).
 */

const baseWorkspaceFields = {
  name: v.string(),
  owner_user_id: v.id("users"),
  billing_customer_id: v.optional(v.string()),
  plan: v.optional(v.string()),
  trial_ends_at: v.optional(v.string()),
} as const;

export const create = mutation({
  args: baseWorkspaceFields,
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return ctx.db.insert("workspaces", {
      ...args,
      created_at: now,
      updated_at: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    data: v.object({
      slug: v.optional(v.string()),
      name: v.optional(v.string()),
      billing_customer_id: v.optional(v.string()),
      plan: v.optional(v.string()),
      trial_ends_at: v.optional(v.string()),
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
  args: { id: v.id("workspaces") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});
