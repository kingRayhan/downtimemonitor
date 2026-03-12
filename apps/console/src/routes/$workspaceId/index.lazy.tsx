import { ConsolePage } from "@/components/console-page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/$workspaceId/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <ConsolePage pageId="dashboard" />
}
