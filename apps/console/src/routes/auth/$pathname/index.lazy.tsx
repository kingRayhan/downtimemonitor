import { AuthView } from "@daveyplate/better-auth-ui"
import { createLazyFileRoute, useLocation } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/auth/$pathname/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { pathname } = useLocation()

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <AuthView pathname={pathname} />
    </main>
  )
}
