import { useAppSession } from "@/providers/AuthProvider"
import { useWorkspace } from "@/providers/WorkspaceProvider"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/$workspaceId/auth-test")({
  component: RouteComponent,
})

function RouteComponent() {
  const { loading, user } = useAppSession()
  const { workspaces, loading: workspaceLoading } = useWorkspace()
  return (
    <pre>
      {JSON.stringify({ loading, user, workspaces, workspaceLoading }, null, 2)}
    </pre>
  )
}
