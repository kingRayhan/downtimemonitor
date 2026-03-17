import { Outlet, createRootRoute } from "@tanstack/react-router"

export const Route = createRootRoute({
  component: RootComponent,
  // beforeLoad: async () => {
  //   const { data } = await betterAuthClient.getSession()
  //   if (!data) {
  //     return redirect({ to: "/auth/sign-in" })
  //   }
  // },
})

function RootComponent() {
  return <Outlet />
}
