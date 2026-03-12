import AppShield from "@/components/app-shield"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <AppShield>
      <Outlet />
    </AppShield>
  )
}
