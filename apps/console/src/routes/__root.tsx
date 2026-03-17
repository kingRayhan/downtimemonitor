import { betterAuthClient } from "@/lib/auth.client"
import { Outlet, createRootRoute, redirect } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    const { data } = await betterAuthClient.getSession()
    if (!data) {
      return redirect({ to: "/auth/sign-in" })
    }
  },
})

function RootComponent() {
  return <Outlet />
}
