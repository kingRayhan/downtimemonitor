import { betterAuthClient } from "@/lib/auth.client"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/organizations")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await betterAuthClient.getSession()
    if (!data) {
      return redirect({
        to: "/auth/$pathname",
        params: { pathname: "sign-in" },
      })
    }
  },
})

function RouteComponent() {
  return <Outlet />
}
