import { betterAuthClient } from "@/lib/auth.client"
import { OrganizationSwitcher, UserButton } from "@daveyplate/better-auth-ui"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: organizations } = betterAuthClient.useListOrganizations()
  const { data: activeOrganization } = betterAuthClient.useActiveOrganization()
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 p-6">
      <UserButton size={"sm"} />
      <OrganizationSwitcher size={"sm"} />

      <pre>
        {JSON.stringify({ organizations, activeOrganization }, null, 2)}
      </pre>
    </div>
  )
}
