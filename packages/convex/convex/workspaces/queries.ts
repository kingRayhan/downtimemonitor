import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
import { v } from "convex/values";

const operatorValidator = v.union(
  v.literal("eq"),
  v.literal("gt"),
  v.literal("gte"),
  v.literal("lt"),
  v.literal("lte")
);

const workspaceFilterKeyValidator = v.union(
  v.literal("slug"),
  v.literal("created_by_user_id"),
  v.literal("created_at"),
  v.literal("updated_at"),
  v.literal("deleted_at")
);

function applyOperator(
  q: any,
  key: string,
  operator: string,
  value: unknown
) {
  const indexName = `by_${key}` as const;
  switch (operator) {
    case "eq":
      return q.withIndex(indexName, (idx: any) => idx.eq(key as any, value));
    case "gt":
      return q.withIndex(indexName, (idx: any) => idx.gt(key as any, value));
    case "gte":
      return q.withIndex(indexName, (idx: any) => idx.gte(key as any, value));
    case "lt":
      return q.withIndex(indexName, (idx: any) => idx.lt(key as any, value));
    case "lte":
      return q.withIndex(indexName, (idx: any) => idx.lte(key as any, value));
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

export const findOne = query({
  args: {
    where: v.object({
      key: workspaceFilterKeyValidator,
      value: v.any(),
      operator: operatorValidator,
    }),
  },
  handler: async (ctx, { where }) => {
    const { key, value, operator } = where;
    const base = ctx.db.query("workspaces");
    return applyOperator(base, key, operator, value).first();
  },
});

export const findById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const findMany = query({
  args: {
    where: v.optional(
      v.object({
        key: workspaceFilterKeyValidator,
        value: v.any(),
        operator: operatorValidator,
      })
    ),
    limit: v.optional(v.number()),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, { where, limit, sortDirection }) => {
    const direction = sortDirection ?? "desc";
    if (!where) {
      return ctx.db.query("workspaces").order(direction).take(limit ?? 10);
    }
    const { key, value, operator } = where;
    const base = ctx.db.query("workspaces");
    return applyOperator(base, key, operator, value)
      .order(direction)
      .take(limit ?? 10);
  },
});

export const paginatedList = query({
  args: {
    pagination: paginationOptsValidator,
    where: v.optional(
      v.object({
        key: workspaceFilterKeyValidator,
        value: v.any(),
        operator: operatorValidator,
      })
    ),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, { pagination, where, sortDirection }) => {
    const direction = sortDirection ?? "desc";
    if (!where) {
      return ctx.db.query("workspaces").order(direction).paginate(pagination);
    }
    const { key, value, operator } = where;
    const base = ctx.db.query("workspaces");
    return applyOperator(base, key, operator, value)
      .order(direction)
      .paginate(pagination);
  },
});

/**
 * List workspaces the given Clerk user is a member of (for switcher dropdown).
 */
export const listForClerkUser = query({
  args: { clerk_user_id: v.string() },
  handler: async (ctx, { clerk_user_id }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerk_user_id", clerk_user_id)
      )
      .first();
    if (!user) return [];

    const memberships = await ctx.db
      .query("workspace_members")
      .withIndex("by_user_id", (q) => q.eq("user_id", user._id))
      .collect();

    const result: { id: (typeof memberships)[0]["workspace_id"]; slug: string; name: string; role: string }[] = [];
    for (const m of memberships) {
      if (m.deleted_at) continue;
      const ws = await ctx.db.get(m.workspace_id);
      if (ws && !ws.deleted_at) {
        result.push({
          id: ws._id,
          slug: ws.slug,
          name: ws.name,
          role: m.role,
        });
      }
    }
    return result;
  },
});

