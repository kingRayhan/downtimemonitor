import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = defineTable({
  // ============================================
  // Identity
  // ============================================
  clerk_user_id: v.string(),
  primary_email: v.string(),
  display_name: v.string(),

  // ============================================
  // Audit Fields
  // ============================================
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
  deleted_at: v.optional(v.string()),
})
  .index("by_clerk_user_id", ["clerk_user_id"])
  .index("by_primary_email", ["primary_email"])
  .index("by_created_at", ["created_at"])
  .index("by_updated_at", ["updated_at"])
  .index("by_deleted_at", ["deleted_at"]);

