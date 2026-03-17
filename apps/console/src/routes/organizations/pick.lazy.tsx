import { betterAuthClient } from "@/lib/auth.client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  createLazyFileRoute,
  redirect,
  useNavigate,
} from "@tanstack/react-router"

export const Route = createLazyFileRoute("/organizations/pick")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { data: organizations, isRefetching } =
    betterAuthClient.useListOrganizations()
  const { data: activeOrganization } = betterAuthClient.useActiveOrganization()

  const handleSelect = async (orgId: string) => {
    try {
      await betterAuthClient.organization.setActive({ organizationId: orgId })

      await navigate({ to: "/" })
    } catch (error) {
      console.error(error)
      alert("Failed to switch organization. Please try again.")
    }
  }

  const handleCreate = () => {
    navigate({ to: "/organizations/create" })
  }

  if (isRefetching) {
    return (
      <main className="container mx-auto flex grow flex-col items-center justify-center p-4 md:p-6">
        <p className="text-sm text-muted-foreground">Loading organizations…</p>
      </main>
    )
  }

  if (!organizations || organizations.length === 0) {
    return (
      <main className="container mx-auto flex grow flex-col items-center justify-center p-4 md:p-6">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-xl font-semibold">No organizations yet</h1>
          <p className="text-sm text-muted-foreground">
            Create your first organization to get started.
          </p>
          <Button onClick={handleCreate}>Create organization</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold">Choose an organization</h1>
          <p className="text-sm text-muted-foreground">
            Select which organization you want to work in.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {organizations.map((org) => {
            const isActive = org.id === activeOrganization?.id
            return (
              <Card
                key={org.id}
                className="cursor-pointer transition hover:border-primary"
                onClick={() => handleSelect(org.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="truncate">{org.name}</span>
                    {isActive && (
                      <span className="text-xs font-medium text-muted-foreground">
                        Active
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs break-all text-muted-foreground">
                    {org.slug}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={handleCreate}>
            + New organization
          </Button>
        </div>
      </div>
    </main>
  )
}
