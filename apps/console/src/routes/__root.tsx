import { betterAuthClient } from "@/lib/auth.client"
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
})

function RootComponent() {
  return <Outlet />
}
