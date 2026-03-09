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

const workspaceMemberFilterKeyValidator = v.union(
  v.literal("workspace_id"),
  v.literal("user_id"),
  v.literal("role"),
  v.literal("created_at"),
  v.literal("deleted_at")
);

type WorkspaceMemberFilterKey = typeof workspaceMemberFilterKeyValidator._type;

function applyOperator(
  q: any,
  key: WorkspaceMemberFilterKey,
  operator: (typeof operatorValidator)["_type"],
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
      throw new Error(`Unsupported operator: ${operator as string}`);
  }
}

export const findOne = query({
  args: {
    where: v.object({
      key: workspaceMemberFilterKeyValidator,
      value: v.any(),
      operator: operatorValidator,
    }),
  },
  handler: async (ctx, { where }) => {
    const { key, value, operator } = where;
    const base = ctx.db.query("workspace_members");
    return applyOperator(base, key, operator, value).first();
  },
});

export const findById = query({
  args: { id: v.id("workspace_members") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});

export const findMany = query({
  args: {
    where: v.optional(
      v.object({
        key: workspaceMemberFilterKeyValidator,
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
      return ctx.db
        .query("workspace_members")
        .order(direction)
        .take(limit ?? 10);
    }
    const { key, value, operator } = where;
    const base = ctx.db.query("workspace_members");
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
        key: workspaceMemberFilterKeyValidator,
        value: v.any(),
        operator: operatorValidator,
      })
    ),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, { pagination, where, sortDirection }) => {
    const direction = sortDirection ?? "desc";
    if (!where) {
      return ctx.db
        .query("workspace_members")
        .order(direction)
        .paginate(pagination);
    }
    const { key, value, operator } = where;
    const base = ctx.db.query("workspace_members");
    return applyOperator(base, key, operator, value)
      .order(direction)
      .paginate(pagination);
  },
});

