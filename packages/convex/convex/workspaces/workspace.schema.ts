import { defineTable } from "convex/server";
import { v } from "convex/values";

export const workspaceSchema = defineTable({
  // ============================================
  // Core
  // ============================================
  slug: v.string(),
  name: v.string(),

  // Relationships
  created_by_user_id: v.id("users"),

  // Billing / plan (optional, can be filled later)
  billing_customer_id: v.optional(v.string()),
  plan: v.optional(v.string()),
  trial_ends_at: v.optional(v.string()),

  // ============================================
  // Audit Fields
  // ============================================
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
  deleted_at: v.optional(v.string()),
})
  .index("by_slug", ["slug"])
  .index("by_created_by_user_id", ["created_by_user_id"])
  .index("by_created_at", ["created_at"])
  .index("by_updated_at", ["updated_at"])
  .index("by_deleted_at", ["deleted_at"]);

