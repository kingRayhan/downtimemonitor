import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  beforeLoad: async (ctx) => {
    if (ctx.context.session.data?.session) {
      return redirect({ to: "/" })
    }
  },
})

function RouteComponent() {
  return (
    <main className="min-h-dvh w-full">
      <Outlet />
    </main>
  )
}
