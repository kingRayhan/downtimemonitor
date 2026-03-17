import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_dashboard/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaceId } = Route.useParams()
  return <div>Hello "/{workspaceId}/settings"!</div>
}
