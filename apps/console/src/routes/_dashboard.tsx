import AppShield from "@/components/app-shell/app-shield"
import { betterAuthClient } from "@/lib/auth.client"
import { jotaiStore } from "@/store"
import { appAuthAtom } from "@/store/auth.atom"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    if (!ctx?.context?.auth?.session) {
      throw redirect({
        to: "/auth/sign-in",
        search: { redirectTo: ctx.location.pathname },
      })
    }

    if (!ctx?.context?.auth?.activeOrganization) {
      const organizations = ctx.context.auth.organizations
      if (organizations && organizations?.length > 0) {
        jotaiStore.set(appAuthAtom, (draft) => {
          draft.activeOrganization = organizations[0]
        })
        await betterAuthClient.organization.setActive({
          organizationId: organizations[0].id,
        })
      } else {
        // redirect to the create organization page
        return redirect({ to: "/organizations/create" })
      }
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
