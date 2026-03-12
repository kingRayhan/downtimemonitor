import { api } from "@repo/convex"
import { useQuery } from "convex/react"
import React from "react"
import { useAppSession } from "./AuthProvider"

// Workspace context

type WorkspaceContextType = {
  workspaces: {
    _id: string
    name: string
    role: "owner" | "admin" | "member" | "viewer"
  }[]
  loading: boolean
}

const WorkspaceContext = React.createContext<WorkspaceContextType>({
  workspaces: [],
  loading: true,
})

const WorkspaceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAppSession()

  const memberships = useQuery(
    api.workspaceMembers.queries.findManyByUserId,
    user?._id ? { userId: user?._id } : "skip"
  )

  const workspaces = useQuery(
    api.workspaces.queries.findByIds,
    memberships
      ? {
          ids: memberships.map((membership) => membership.workspace_id),
        }
      : "skip"
  )

  const loading =
    !!user && (!memberships || (memberships.length > 0 && !workspaces))

  const myWorkspaces =
    workspaces?.map((ws) => {
      const membership = memberships?.find((m) => m.workspace_id === ws._id)
      return {
        _id: ws._id,
        name: ws.name,
        role: membership?.role ?? "member",
      }
    }) ?? []

  return (
    <WorkspaceContext.Provider value={{ workspaces: myWorkspaces, loading }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export default WorkspaceProvider

export const useWorkspace = () => {
  const context = React.useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
