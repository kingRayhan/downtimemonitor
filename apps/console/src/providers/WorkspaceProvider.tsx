import React from "react"

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
  const myWorkspaces: WorkspaceContextType["workspaces"] = []

  return (
    <WorkspaceContext.Provider
      value={{ workspaces: myWorkspaces, loading: false }}
    >
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
