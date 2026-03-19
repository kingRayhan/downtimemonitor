import AppShield from "@/components/app-shell/app-shield"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  async beforeLoad(ctx) {
    // if (!ctx.context.session) {
    //   throw redirect({
    //     to: "/auth/sign-in",
    //     search: { redirectTo: ctx.location.pathname },
    //   })
    // }

    // // check member has any organization membership

    // if (!ctx.context.activeOrganization.data) {
    //   console.log("no active organization")
    //   // check if member has any organization membership
    //   const organizations = ctx.context.organizations?.data

    //   if (organizations && organizations?.length > 0) {
    //     console.log("setting first organization as active")
    //     // set the first organization as the active organization
    //     await betterAuthClient.organization.setActive({
    //       organizationId: organizations[0].id,
    //     })
    //   } else {
    //     console.log("no organizations, redirecting to create organization page")
    //     // redirect to the create organization page
    //     return redirect({ to: "/organizations/create" })
    //   }
    // }

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
