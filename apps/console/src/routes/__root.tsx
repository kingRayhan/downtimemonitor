import { betterAuthClient } from "@/lib/auth.client"
import { Outlet, createRootRoute, redirect } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
  beforeLoad: async () => {
    // const { data: session } = await betterAuthClient.getSession()
    // if (!session) {
    //   return redirect({ to: "/auth/sign-in" })
    // }
    // if (session) {
    //   const { data: organizations, error: errorOrganizations } =
    //     await betterAuthClient.organization.list()
    //   if (!errorOrganizations) {
    //     if (organizations.length) {
    //       betterAuthClient.organization.setActive({
    //         organizationId: organizations[0].id,
    //       })
    //     } else {
    //       redirect({ to: "/organizations/create" })
    //     }
    //   }
    // }
  },
})

function RootComponent() {
  return <Outlet />
}
