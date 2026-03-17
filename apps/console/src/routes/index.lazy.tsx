import { OrganizationSwitcher } from "@daveyplate/better-auth-ui"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 p-6">
      <OrganizationSwitcher size={"sm"} />
    </div>
  )
}
