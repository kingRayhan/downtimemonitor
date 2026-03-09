import { defineTable } from "convex/server";
import { v } from "convex/values";

export const workspaceMemberSchema = defineTable({
  // ============================================
  // Relationships
  // ============================================
  workspace_id: v.id("workspaces"),
  user_id: v.id("users"),

  // Membership
  role: v.union(
    v.literal("owner"),
    v.literal("admin"),
    v.literal("member"),
    v.literal("viewer")
  ),

  invited_by_user_id: v.optional(v.id("users")),

  invited_at: v.optional(v.string()),
  accepted_at: v.optional(v.string()),

  // ============================================
  // Audit Fields
  // ============================================
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
  deleted_at: v.optional(v.string()),
})
  .index("by_workspace_id", ["workspace_id"])
  .index("by_user_id", ["user_id"])
  .index("by_workspace_id_and_user_id", ["workspace_id", "user_id"])
  .index("by_role", ["role"])
  .index("by_created_at", ["created_at"])
  .index("by_deleted_at", ["deleted_at"]);

