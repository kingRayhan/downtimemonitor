import { useWorkspace } from "@/providers/WorkspaceProvider"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaces, loading: workspaceLoading } = useWorkspace()
  if (workspaceLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <pre>{JSON.stringify({ workspaces, workspaceLoading }, null, 2)}</pre>
    </div>
  )
}
