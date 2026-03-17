import { ConsolePage } from "@/components/console-page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  return <ConsolePage pageId="dashboard" />
}
