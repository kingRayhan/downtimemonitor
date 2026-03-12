import AppShield from "@/components/app-shield"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/$workspaceId")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppShield>
      <Outlet />
    </AppShield>
  )
}
