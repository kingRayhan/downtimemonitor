import { defineSchema } from "convex/server";

import { userSchema } from "./users/user.schema";
import { workspaceSchema } from "./workspaces/workspace.schema";
import { workspaceMemberSchema } from "./workspaceMembers/workspaceMember.schema";
import { workspaceInviteSchema } from "./workspaceInvites/workspaceInvite.schema";

export default defineSchema({
  users: userSchema,
  workspaces: workspaceSchema,
  workspace_members: workspaceMemberSchema,
  workspace_invites: workspaceInviteSchema,
});

