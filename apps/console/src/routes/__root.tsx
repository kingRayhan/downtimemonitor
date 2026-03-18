import { betterAuthClient } from "@/lib/auth.client"
import { AppLoadingScreen } from "@/components/app-loading-screen"
import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async (ctx) => {
    const session = await betterAuthClient.getSession()
    return {
      ...ctx,
      session,
    }
  },
  pendingComponent: () => <AppLoadingScreen label="Loading session…" />,
})

function RootComponent() {
  return <Outlet />
}
