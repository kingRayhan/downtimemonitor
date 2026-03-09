# Convex domain module architecture

Reference for how we structure Convex domains in `packages/convex/convex/` so new modules stay consistent, generic, and easy to consume from `core-api`.

The **`users` module** is the canonical example — use it as the blueprint for every new domain.

---

## 1. Core principles

| Principle | Rule |
|---|---|
| **Convex = data access only** | Define table shapes and **generic** CRUD-style functions. No use-case names or business logic. (`registerB2BTenant` is wrong; `create` / `update` is right.) |
| **Backend (core-api) = orchestration** | HTTP, validation, auth, cross-table flows. Talks to Convex via `convexClient.query` / `convexClient.mutation`. Owns Cognito, Supabase, email, SMS, Stripe, etc. |
| **Generic naming** | Function names are verbs that describe the *data operation*, never the business use-case. Good: `create`, `update`, `remove`, `findOne`, `findMany`, `paginatedList`. Bad: `onboardUser`, `approveApplication`. |
| **No cross-table writes** | A mutation file touches **one** table only. Multi-table transactions belong in `core-api` (call multiple mutations in sequence). |

Result: Convex is a **stable data layer**; `core-api` is the **use-case layer**.

---

## 2. Global schema (`convex/schema.ts`)

Single file at the root — imports every domain schema and registers table names:

```ts
// convex/schema.ts
import { defineSchema } from "convex/server";
import { tenantSchema } from "./tenants/tenant.schema";
import { userSchema } from "./users/user.schema";
import { membershipSchema } from "./memberships/membership.schema";

export default defineSchema({
  tenants: tenantSchema,
  users: userSchema,
  memberships: membershipSchema,
});
```

- The **key** in `defineSchema` is the **table name** used everywhere: `ctx.db.insert("users", ...)`, `v.id("users")`, `ctx.db.query("users")`.
- Each domain folder exports its own `defineTable(...)` — it does **not** call `defineSchema`.

---

## 3. Directory layout (per domain)

```
convex/
  schema.ts                       # imports all domain schemas
  <domain>/
    <domain>.schema.ts            # defineTable + indexes
    mutations.ts                  # public mutations (create / update / remove)
    queries.ts                    # public queries (findOne / findById / findMany / paginatedList)
```

**Reference: `users/`**

```
convex/users/
  user.schema.ts     →  table definition + indexes
  mutations.ts       →  create, update, remove
  queries.ts         →  findOne, findById, findMany, paginatedList
```

| File | Purpose | Convex API path |
|---|---|---|
| `<domain>.schema.ts` | `defineTable(...)` — fields, validators, indexes. Exported as a named const. | — (imported in `schema.ts`) |
| `mutations.ts` | Public mutations callable from client and backend. | `api.<domain>.mutations.*` |
| `queries.ts` | Public queries. | `api.<domain>.queries.*` |

---

## 4. Schema file rules (`<domain>.schema.ts`)

Use the **users** schema as the reference:

```ts
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userSchema = defineTable({
  // ============================================
  // Section heading
  // ============================================
  email: v.string(),
  first_name: v.string(),
  // ... other fields ...

  // ============================================
  // Audit Fields
  // ============================================
  deleted_at: v.optional(v.string()),
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
})
  .index("by_email", ["email"])
  .index("by_created_at", ["created_at"])
  .index("by_updated_at", ["updated_at"])
  .index("by_deleted_at", ["deleted_at"]);
```

### 4.1 Field conventions

| Convention | Detail |
|---|---|
| **Snake_case** | All field names use `snake_case`. |
| **Timestamps as ISO strings** | `created_at`, `updated_at`, `deleted_at`, and all date fields are `v.optional(v.string())` holding ISO-8601 strings. |
| **Soft deletion** | Include `deleted_at: v.optional(v.string())` on every table. |
| **Audit fields on every table** | Always add `created_at`, `updated_at`, and `deleted_at`. |
| **Foreign keys use `v.id("<table>")`** | e.g. `created_by_user_id: v.optional(v.id("users"))`. |
| **Section comments** | Group related fields with `// ===` comment banners for readability. |

### 4.2 Index conventions

| Convention | Detail |
|---|---|
| **One index per filterable field** | Name: `by_<field>`, fields: `[<field>]`. Example: `.index("by_email", ["email"])`. |
| **Every field in `filterKeyValidator` must have an index** | Queries use `withIndex("by_<key>")` — this breaks if the index doesn't exist. |
| **Compound indexes** | Name: `by_<field1>_and_<field2>` or descriptive name like `tenant_user`. Only when queries routinely filter on the combination. |

---

## 5. Mutations file rules (`mutations.ts`)

### 5.1 File structure

```ts
import { mutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Public user mutations.
 * Generic data operations only (no business logic).
 */

// ── Shared validators ──────────────────────────────
const timeFormatValidator = v.optional(
  v.union(v.literal("12"), v.literal("24"))
);

// ── Shared base fields ─────────────────────────────
const baseUserFields = {
  email: v.optional(v.string()),
  first_name: v.optional(v.string()),
  // ... mirrors schema fields, all optional for reuse by create & update
} as const;

// ── Mutations ──────────────────────────────────────
export const create = mutation({ ... });
export const update = mutation({ ... });
export const remove = mutation({ ... });
```

### 5.2 Standard mutations (required for every domain)

#### `create`

- **Args**: `baseFields` object (required fields are `v.string()`, optional are `v.optional(...)`).
- **Handler**: Inserts the record and auto-sets `created_at` and `updated_at` to `new Date().toISOString()`.
- **Returns**: The new document `_id`.

```ts
export const create = mutation({
  args: baseUserFields,
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const userId = await ctx.db.insert("users", {
      ...args,
      created_at: now,
      updated_at: now,
    } as any);
    return userId;
  },
});
```

#### `update`

- **Args**: `{ id: v.id("<table>"), data: v.object(baseFields) }`.
- **Handler**: Patches the document by `_id`. Does **not** look up by filter — that's a query concern.
- Auto-sets `updated_at`.
- **Returns**: The patch result.

```ts
export const update = mutation({
  args: {
    id: v.id("users"),
    data: v.object(baseUserFields),
  },
  handler: async (ctx, { id, data }) => {
    return ctx.db.patch(id, data);
  },
});
```

#### `remove`

- **Args**: `{ id: v.id("<table>") }`.
- **Handler**: Hard-deletes by `_id`. (For soft-delete, use `update` to set `deleted_at`.)
- **Returns**: The delete result.

```ts
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return ctx.db.delete(id);
  },
});
```

### 5.3 Additional mutations

Beyond the three standard ones, you may add **field-specific** helpers when the update shape is narrow and reused often:

```ts
// memberships/mutations.ts
export const updateStatus = mutation({
  args: {
    id: v.id("memberships"),
    status: v.union(v.literal("ACTIVE"), v.literal("INACTIVE")),
  },
  handler: async (ctx, { id, status }) => {
    await ctx.db.patch(id, { status });
    return id;
  },
});
```

Name these `update<Field>` or `update<Concept>` — they must still be generic data ops, not business actions.

### 5.4 What does NOT belong in mutations

| Forbidden | Why |
|---|---|
| Cross-table writes | `core-api` orchestrates multi-table flows. |
| Conditional business logic | e.g. "if tenant is B2B then also create membership" — belongs in `api-services`. |
| External API calls | Supabase, Stripe, email — `api-services` territory. |
| Auth / permission checks | Handled at the HTTP layer in `api-services`. |

---

## 6. Queries file rules (`queries.ts`)

### 6.1 File structure

```ts
import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

// ── Shared validators ──────────────────────────────
const operatorValidator = v.union(
  v.literal("eq"),
  v.literal("gt"),
  v.literal("gte"),
  v.literal("lt"),
  v.literal("lte")
);

const userFilterKeyValidator = v.union(
  v.literal("email"),
  v.literal("first_name"),
  v.literal("created_at"),
  // ... one literal per indexed field
);

// ── Queries ────────────────────────────────────────
export const findOne = query({ ... });
export const findById = query({ ... });
export const findMany = query({ ... });
export const paginatedList = query({ ... });
```

### 6.2 Shared validators

#### `operatorValidator`

Standard across all domains. Supported operators: `eq`, `gt`, `gte`, `lt`, `lte`.

> **Note**: We intentionally exclude `neq` because `withIndex` does not support not-equal. All queries must use indexes.

#### `<domain>FilterKeyValidator`

A `v.union(...)` of `v.literal("<field>")` entries — **one per indexed field**. This acts as a whitelist that keeps the `where` clause type-safe and guarantees every filter hits an index.

### 6.3 Standard queries (required for every domain)

#### `findOne`

Returns the **first** document matching a `where` filter, or `null`.

```ts
export const findOne = query({
  args: {
    where: v.object({
      key: userFilterKeyValidator,
      value: v.any(),
      operator: operatorValidator,
    }),
  },
  handler: async (ctx, { where }) => {
    const { key, value, operator } = where;
    switch (operator) {
      case "eq":
        return ctx.db.query("users")
          .withIndex(`by_${key}`, (q) => q.eq(key as any, value))
          .first();
      case "gt":
        return ctx.db.query("users")
          .withIndex(`by_${key}`, (q) => q.gt(key as any, value))
          .first();
      // ... gte, lt, lte follow the same pattern
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  },
});
```

**Key rules**:
- Always use `withIndex("by_<key>")` — never `.filter()`.
- Each operator arm builds a fresh query with the appropriate index range.
- Throw on unsupported operator.

#### `findById`

Direct lookup by Convex `_id`.

```ts
export const findById = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => ctx.db.get(id),
});
```

#### `findMany`

Returns an array of matching documents with optional filtering, sorting, and limit.

```ts
export const findMany = query({
  args: {
    where: v.optional(v.object({
      key: userFilterKeyValidator,
      value: v.any(),
      operator: operatorValidator,
    })),
    limit: v.optional(v.number()),
    sortBy: v.optional(userFilterKeyValidator),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, { where, limit, sortDirection }) => {
    if (!where) {
      return ctx.db.query("users")
        .order(sortDirection ?? "desc")
        .take(limit ?? 10);
    }
    const { key, value, operator } = where;
    // switch on operator, same withIndex pattern as findOne
    // use .order(sortDirection ?? "desc").take(limit ?? 10)
  },
});
```

**Key rules**:
- `where` is optional — when absent, return unfiltered results.
- Default `limit` is `10`, default `sortDirection` is `"desc"`.
- Uses `.take(limit)` (not `.collect()`) to cap result size.

#### `paginatedList`

Cursor-based pagination using Convex's built-in `paginationOptsValidator`.

```ts
export const paginatedList = query({
  args: {
    pagination: paginationOptsValidator,
    where: v.optional(v.object({
      key: userFilterKeyValidator,
      value: v.any(),
      operator: operatorValidator,
    })),
    orderBy: v.optional(v.union(v.literal("created_at"), v.literal("updated_at"))),
    sortDirection: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
    sortBy: v.optional(userFilterKeyValidator),
  },
  handler: async (ctx, args) => {
    const { pagination, where, sortDirection } = args;
    // If no where clause → unfiltered paginated query
    // Otherwise → withIndex + operator switch
    // .order(sortDirection ?? "desc").paginate(pagination)
  },
});
```

### 6.4 Query performance rules

| Rule | Detail |
|---|---|
| **Always use `withIndex`** | Every filtered query must use `withIndex("by_<key>", ...)`. Never use `.filter()` for field comparisons — it scans the entire table. |
| **Index name convention** | `by_<key>` — matches the schema `.index(...)` names. The `filterKeyValidator` guarantees only indexed keys are accepted. |
| **Cap results** | `findMany` uses `.take(limit)` with a default. `paginatedList` uses `.paginate(pagination)`. Never return unbounded result sets. |
| **Default sort direction** | `"desc"` (newest first) unless the caller specifies otherwise. |

---

## 7. Naming & export conventions

| Item | Convention | Example |
|---|---|---|
| **Schema export** | `export const <domain>Schema = defineTable(...)` | `export const userSchema = ...` |
| **Mutation names** | `create`, `update`, `remove`, optionally `update<Field>` | `create`, `updateStatus` |
| **Query names** | `findOne`, `findById`, `findMany`, `paginatedList` | — |
| **Validator names** | `<domain>FilterKeyValidator`, `operatorValidator`, `base<Domain>Fields` | `userFilterKeyValidator`, `baseUserFields` |
| **Imports** | Always from `../_generated/server` and `convex/values` | `import { mutation } from "../_generated/server"` |

---

## 8. Checklist for adding a new domain

1. **Create the folder**: `convex/<domain>/`
2. **Schema**: Create `<domain>.schema.ts`
   - [ ] Export `<domain>Schema` via `defineTable(...)`
   - [ ] Add `created_at`, `updated_at`, `deleted_at` audit fields
   - [ ] Add `.index("by_<field>", [<field>])` for every filterable field
3. **Register in `schema.ts`**:
   - [ ] Import and add to `defineSchema({ ... })`
4. **Mutations**: Create `mutations.ts`
   - [ ] Add file-level JSDoc: `"Generic data operations only (no business logic)."`
   - [ ] Extract shared validators and `base<Domain>Fields`
   - [ ] Implement `create`, `update`, `remove`
   - [ ] `create` auto-sets `created_at` + `updated_at`
   - [ ] `update` takes `id` + `data`, uses `ctx.db.patch`
   - [ ] `remove` takes `id`, uses `ctx.db.delete`
5. **Queries**: Create `queries.ts`
   - [ ] Define `operatorValidator` (same across all domains)
   - [ ] Define `<domain>FilterKeyValidator` — one `v.literal()` per indexed field
   - [ ] Implement `findOne`, `findById`, `findMany`, `paginatedList`
   - [ ] All filtered queries use `withIndex` (never `.filter()`)
   - [ ] `findMany` defaults: `limit = 10`, `sortDirection = "desc"`
   - [ ] `paginatedList` uses `paginationOptsValidator`
6. **Verify**: Run `npx convex dev` — schema push should succeed with no errors.

---

## 9. How `core-api` consumes Convex

The backend calls Convex functions through the generated API:

```ts
// core-api service example
const user = await convexClient.query(api.users.queries.findOne, {
  where: { key: "email", value: email, operator: "eq" },
});

const userId = await convexClient.mutation(api.users.mutations.create, {
  email,
  first_name,
  date_of_birth,
  ssn_id,
  country_code,
  state: null,
});

await convexClient.mutation(api.users.mutations.update, {
  id: userId,
  data: { is_onboard: true },
});
```

Multi-table orchestration happens **only** in `core-api`:

```ts
// register-tenant.service.ts (core-api)
const userId = await convexClient.mutation(api.users.mutations.create, { ... });
const tenantId = await convexClient.mutation(api.tenants.mutations.create, { ... });
await convexClient.mutation(api.memberships.mutations.create, {
  user_id: userId,
  tenant_id: tenantId,
  role: "TENANT_ADMIN",
  status: "ACTIVE",
});
```

Convex never knows about "tenant registration" — it just sees three independent inserts.
