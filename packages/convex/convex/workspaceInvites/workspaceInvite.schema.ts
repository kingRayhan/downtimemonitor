import { defineTable } from "convex/server";
import { v } from "convex/values";

export const workspaceInviteSchema = defineTable({
  // ============================================
  // Relationships
  // ============================================
  workspace_id: v.id("workspaces"),
  invited_by_user_id: v.id("users"),

  // Invite details
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

  // ============================================
  // Audit Fields
  // ============================================
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
  deleted_at: v.optional(v.string()),
})
  .index("by_workspace_id", ["workspace_id"])
  .index("by_email", ["email"])
  .index("by_token", ["token"])
  .index("by_status", ["status"])
  .index("by_created_at", ["created_at"])
  .index("by_deleted_at", ["deleted_at"]);

