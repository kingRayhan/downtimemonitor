## Goals

- **Use Clerk for authentication** (signup, login, sessions, social, MFA).
- **Own multi-tenancy model** in our Convex backend (workspaces/organizations, roles, permissions).
- **Isolate data per workspace** while allowing a single Clerk user to belong to many workspaces.
- **Keep routing simple** for now by using a workspace slug in the URL instead of subdomains.

---

## High-level architecture

- **Identity layer (Clerk)**
  - Source of truth for user identity, email, password, OAuth, sessions.
  - Frontend uses `ClerkProvider`, `SignedIn`, `SignedOut`, `useUser`, etc.
  - Backend (Convex) verifies Clerk JWTs and reads `userId`, email, profile data.

- **Application layer (Convex + our DB)**
  - Stores **users**, **workspaces**, **memberships**, roles, and all domain data.
  - Links each internal user to a Clerk user via `clerkUserId`.
  - Enforces tenant scoping and authorization for all queries/mutations.

- **Routing layer (console app)**
  - All app routes live under a **workspace slug prefix**, e.g.:
    - `/app/:workspaceSlug/dashboard`
    - `/app/:workspaceSlug/monitors`
    - `/app/:workspaceSlug/incidents`
  - Workspace is resolved once (from the slug) and injected into router context / Convex calls.

---

## Data model (Convex)

**Collections (example names):**

- **`users`**
  - `id` (Convex doc id)
  - `clerkUserId` (string, unique)
  - `primaryEmail` (string)
  - `displayName` (string)
  - `createdAt`

- **`workspaces`**
  - `id`
  - `slug` (string, unique, URL-safe)
  - `name` (string)
  - `createdBy` (user id)
  - `createdAt`
  - (optional) `billingCustomerId`, `plan`, `trialEndsAt`

- **`workspaceMembers`**
  - `id`
  - `workspaceId`
  - `userId`
  - `role` (`"owner" | "admin" | "member" | "viewer"`)
  - `createdAt`
  - (optional) `invitedBy`, `invitedAt`, `acceptedAt`

- **`workspaceInvites`** (optional, later)
  - `id`
  - `workspaceId`
  - `email`
  - `role`
  - `token` / `code`
  - `status` (`"pending" | "accepted" | "expired"`)

**Key rules:**

- Every **Convex query/mutation** that operates on tenant data:
  - Receives `workspaceId` (derived from slug).
  - Checks membership in `workspaceMembers`.
  - Optionally checks `role` for elevated actions.

---

## Auth & user provisioning flow

1. **User signs in/up with Clerk** in the console app.
2. Frontend gets a **Clerk session token/JWT** and passes it to Convex.
3. Convex runs an **auth wrapper** on all protected functions:
   - Verifies the Clerk token server-side.
   - Extracts `clerkUserId`, email.
   - Looks up or **creates** an internal `users` record.
4. On **first login**, create a **default workspace**:
   - Generate a slug from the user/org name (e.g. `acme`, `rayhan-personal`).
   - Insert into `workspaces`.
   - Insert owner membership into `workspaceMembers`.
5. Return the user’s **workspaces list** and a **currentWorkspace** selection.

---

## Workspace routing strategy

**URL shape:**

- `/app/:workspaceSlug/...` inside the console app.
- Example routes:
  - `/app/:workspaceSlug/dashboard`
  - `/app/:workspaceSlug/monitors`
  - `/app/:workspaceSlug/incidents`
  - `/app/:workspaceSlug/logs`
  - `/app/:workspaceSlug/alerts`
  - `/app/:workspaceSlug/status-pages`
  - `/app/:workspaceSlug/settings`

**TanStack Router integration:**

- Add a **workspace layout route**:
  - Path: `/app/$workspaceSlug`
  - Loader:
    - Validates Clerk auth (redirects to login if none).
    - Looks up workspace by `workspaceSlug` in Convex.
    - Verifies membership for the current user.
    - Injects `workspace` + `membership` into route context.
  - Wraps children with `AppShield` and provides workspace context.

- Child routes under the layout:
  - `/app/$workspaceSlug/` → Dashboard
  - `/app/$workspaceSlug/monitors`
  - `/app/$workspaceSlug/monitors/$monitorId`
  - `/app/$workspaceSlug/incidents`
  - etc.

---

## Frontend integration (Clerk + Convex + router)

1. **Set up Clerk in console app**
   - Wrap TanStack Router with `ClerkProvider` at the root.
   - Use `SignedIn` / `SignedOut` for top-level gating (show login vs app).
   - Use `useUser()` and `useAuth()` to get tokens and user metadata.

2. **Convex client auth**
   - Use Clerk’s `getToken()` to attach a **Clerk JWT** to Convex client calls.
   - On the Convex side, verify the token and map to internal `userId`.

3. **Workspace selection UI**
   - In `SiteHeader`, replace the placeholder "Workspace selector" with:
     - A dropdown listing all workspaces for the current user.
     - Clicking an entry navigates to `/app/:workspaceSlug/...` via TanStack Router.

4. **Route protection**
   - All routes under `/app/$workspaceSlug` assume **signed-in**.
   - If Convex loader detects missing membership, redirect to:
     - A "no access" page, or
     - A workspace creation/onboarding flow.

---

## Backend multi-tenancy enforcement (Convex)

- Create a shared **helper** for Convex functions, e.g. `withWorkspaceAuth`:
  - Verifies Clerk token.
  - Loads internal `user`.
  - Given `workspaceSlug` or `workspaceId`, checks membership.
  - Returns `{ user, workspace, membership }` to the handler.

- Each Convex query/mutation:
  - Calls this helper first.
  - Uses `workspace.id` as a filter for all reads/writes.

- Optional: introduce **role-based checks**:
  - `requireRole('admin')` / `requireRole(['owner', 'admin'])` for sensitive actions.

---

## Migration and rollout plan

1. **Phase 1 – Clerk integration**
   - Add Clerk to console app.
   - Wire Clerk tokens into Convex and create internal `users`.
   - Keep app single-tenant temporarily (no workspaces in URLs yet).

2. **Phase 2 – Multi-tenancy model**
   - Create `workspaces`, `workspaceMembers`, and helpers in Convex.
   - Implement default workspace provisioning on first login.
   - Build a simple "switch workspace" UI using the header.

3. **Phase 3 – Route refactor**
   - Move existing console routes under `/app/$workspaceSlug`.
   - Update all links and navigation to include `workspaceSlug`.
   - Add loaders/guards for workspace membership.

4. **Phase 4 – Authorization hardening**
   - Add roles and enforce them in Convex functions.
   - Add "no access" and "invite" flows.

5. **Phase 5 – Nice-to-haves**
   - Custom domains or subdomains per workspace (later).
   - Billing integration per workspace.
   - Audit logs per workspace.

---

## Open questions / decisions

- **Workspace slug source**: user-chosen vs auto-generated from org name.
- **How to invite users**: email-based invites vs shareable links.
- **Default workspace behavior**:
  - On login, should we always go to the **last used** workspace or a default?
- **Subdomains in the future**:
  - When/if we move to `:workspaceSlug.downtime.com`, we’ll keep the same Convex schema and only change routing + tenant resolution.

