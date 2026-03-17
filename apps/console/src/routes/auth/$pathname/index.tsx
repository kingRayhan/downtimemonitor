import { betterAuthClient } from "@/lib/auth.client"
import { AuthView } from "@daveyplate/better-auth-ui"
import { redirect, useLocation, createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/$pathname/")({
  component: RouteComponent,
  beforeLoad: async () => {
    const { data } = await betterAuthClient.getSession()
    if (data) {
      return redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  const { pathname } = useLocation()

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView pathname={pathname} redirectTo="/" />
    </main>
  )
}
