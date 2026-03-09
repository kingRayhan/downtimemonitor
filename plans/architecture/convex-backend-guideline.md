# Using Convex from the backend (core-api)

Guideline for how we use Convex in backend services. **Convex is the data source; we do not put business logic in Convex.**

See also: [Convex domain module architecture](./convex-architecture.md).

---

## 1. Principle: Convex as data source only

- **Convex** = general data layer. Convex functions are **generic** data operations: queries return data; mutations are CRUD-style (e.g. `create`, `update`, `remove`), not use-case-named (no `createB2BTenant`). No validation rules, no orchestration, no calls to other services.
- **Backend (core-api)** = HTTP, validation, business rules, orchestration, and calling Convex (and other services like Cognito, email, etc.). All “business logic” and use-case composition (e.g. “register B2B”) live here.

So: **backend owns the “what and when”; Convex owns the “how to read/write” with generic data operations only.**

---

## 2. Where Convex is used in the backend

Convex is used **only in the service layer** of each domain. HTTP handlers never import Convex.

| Layer | Role | Convex? |
|-------|------|--------|
| **HTTP** (`domains/<domain>/interfaces/http/<domain>.http.ts`) | Routes, request/response, validation (Elysia `t`), status codes | **No** — only calls the domain service |
| **Service** (`domains/<domain>/services/<use-case-name>.service.ts`) | Business logic, orchestration, validation, calling Convex and other infra | **Yes** — single place that talks to Convex |

---

## 3. Backend domain layout (reference: todos)

## Folder structure
```bash
apps/core-api/src/domains/<domain>/
  interfaces/
    http/
      <domain>.http.ts # Routes only; derives a service, delegates to it
      <domain>.schema.ts ## request and response schema for the domain
    ...
  services/
    <use-case-name>.service.ts # All Convex (and other) calls; business logic 
    ...
  docs/
    README.md          # (Optional) Endpoints and env
```

---

## 4. How to call Convex from a service

- Use the shared **HTTP client** and the **public or internal** API:

```ts
import { api, convexClient } from "@repo/convex/client";
import { internal } from "@repo/convex";
```

- **Queries** (read):

```ts
const result = await convexClient.query(api.todos.queries.paginatedList, {
  pagination: { numItems: 10, cursor: null },
  order: "desc",
});
```

- **Mutations** (write), public:

```ts
const id = await convexClient.mutation(api.todos.mutations.create, {
  task: input.task,
  completed: input.completed ?? false,
});
```

- **Internal mutations** (backend-only): Convex is a **general data layer**. Mutations are generic CRUD-style operations (e.g. `internal.tenants.create`, `internal.tenants.remove`), not use-case-specific. The backend composes them into use cases (e.g. “register B2B” = build tenant document, call `internal.tenants.create`, then Cognito, then rollback with `internal.tenants.remove` on failure).

```ts
// Convex: generic data mutation (e.g. internal.tenants.create)
const tenantId = await convexClient.mutation(internal.tenants.create, {
  name: args.name,
  type: "B2B",
  representative_email: args.representative_email,
  // ... all fields the tenant table needs
});
```

- Prefer **public** `api.*` when the same operation is used by the client and the backend. Use **internal** `internal.*` for backend-only data operations. Do **not** add use-case-named mutations in Convex (e.g. no `createB2BTenant`); keep Convex to generic `create` / `update` / `remove` (or equivalent) and put B2B/B2C/registration logic in the backend service.

---

## 5. What belongs in Convex vs in the backend

| In Convex (data only) | In backend (core-api service) |
|-----------------------|--------------------------------|
| Table shape (schema) | Request/response validation (Elysia `t`) |
| Insert / patch / delete for one table | Validation rules (e.g. “email must be unique”, “B2B requires EIN”) |
| Queries (by id, list, paginate) | Orchestration (e.g. create tenant then create Cognito user, then rollback tenant on failure) |
| Returning raw documents or simple projections | Mapping Convex docs to API DTOs, error handling, HTTP status codes |
| — | Calling other services (Cognito, email, etc.) |
| — | Transaction-like flows (create in Convex, then external call; rollback Convex on external failure) |

Convex functions should stay **thin**: validate args with `v.*`, then `ctx.db.insert` / `ctx.db.query` / `ctx.db.patch` / `ctx.db.delete`. No `if (businessRule)` that isn’t “is this ID valid?” or “does this record exist?”.

---

## 6. Example: todos domain

**Service** (`todo.service.ts`) — only place that touches Convex:

```ts
import type { Id } from "@repo/convex/dataModel";
import type { CreateTodoInput } from "../types/todo";
import { api, convexClient } from "@repo/convex/client";

export function createTodoService() {
  return {
    async listPaginated(pagination, order?) {
      return convexClient.query(api.todos.queries.paginatedList, { pagination, order });
    },
    async get(id: Id<"todos">) {
      return convexClient.query(api.todos.queries.get, { key: "id", value: id, operator: "gte" });
    },
    async create(input: CreateTodoInput) {
      return convexClient.mutation(api.todos.mutations.create, input);
    },
  };
}
```
