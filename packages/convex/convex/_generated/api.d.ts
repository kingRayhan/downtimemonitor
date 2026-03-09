/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as users_mutations from "../users/mutations.js";
import type * as users_queries from "../users/queries.js";
import type * as workspaceInvites_mutations from "../workspaceInvites/mutations.js";
import type * as workspaceInvites_queries from "../workspaceInvites/queries.js";
import type * as workspaceMembers_mutations from "../workspaceMembers/mutations.js";
import type * as workspaceMembers_queries from "../workspaceMembers/queries.js";
import type * as workspaces_mutations from "../workspaces/mutations.js";
import type * as workspaces_queries from "../workspaces/queries.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  "users/mutations": typeof users_mutations;
  "users/queries": typeof users_queries;
  "workspaceInvites/mutations": typeof workspaceInvites_mutations;
  "workspaceInvites/queries": typeof workspaceInvites_queries;
  "workspaceMembers/mutations": typeof workspaceMembers_mutations;
  "workspaceMembers/queries": typeof workspaceMembers_queries;
  "workspaces/mutations": typeof workspaces_mutations;
  "workspaces/queries": typeof workspaces_queries;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
