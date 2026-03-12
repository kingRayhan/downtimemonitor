import AppShield from "@/components/app-shield"
import { WorkspaceLoader } from "@/components/workspace-loader"
import { RedirectWhenNoWorkspace } from "@/components/redirect-when-no-workspace"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <WorkspaceLoader>
      
      <AppShield>
        <Outlet />
      </AppShield>
    </WorkspaceLoader>
  )
}
