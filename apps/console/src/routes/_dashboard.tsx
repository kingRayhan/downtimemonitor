import AppShield from "@/components/app-shell/app-shield"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    if (!ctx.context.session.data?.session) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirectTo: ctx.location.pathname },
      })
    }

    return ctx
  },
})

function RouteComponent() {
  return (
    <AppShield>
      <Outlet />
    </AppShield>
  )
}
