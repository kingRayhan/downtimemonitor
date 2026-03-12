import type { Doc } from "node_modules/@repo/convex/convex/_generated/dataModel"
import React from "react"

// Workspace context

type WorkspaceContextType = {
  myWorkspaces: Doc<"workspaces">[]
}

const WorkspaceContext = React.createContext<WorkspaceContextType>({
  myWorkspaces: [],
})

const WorkspaceProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // const myWorkspaces = useQuery(api.workspaces.queries.findMany, {
  //   where: {
  //     owner_user_id: user?.id,
  //   },
  // })
  return (
    <WorkspaceContext.Provider value={{ myWorkspaces: [] }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export default WorkspaceProvider

export const useWorkspace = () => {
  return React.useContext(WorkspaceContext)
}
