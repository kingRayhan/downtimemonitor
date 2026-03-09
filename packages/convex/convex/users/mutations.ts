import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Public user mutations.
 * Generic data operations only (no business logic).
 */

// ── Shared base fields ─────────────────────────────
const baseUserFields = {
  clerk_user_id: v.string(),
  primary_email: v.string(),
  display_name: v.string(),
} as const;

// ── Mutations ──────────────────────────────────────

export const create = mutation({
  args: baseUserFields,
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const id = await ctx.db.insert("users", {
      ...args,
      created_at: now,
      updated_at: now,
    } as any);
    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      clerk_user_id: v.optional(v.string()),
      primary_email: v.optional(v.string()),
      display_name: v.optional(v.string()),
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
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return id;
  },
});

