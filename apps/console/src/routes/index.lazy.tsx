import { useWorkspace } from "@/providers/WorkspaceProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, createLazyFileRoute } from "@tanstack/react-router"
import { betterAuthClient } from "@/lib/auth.client"
import { UserButton } from "@daveyplate/better-auth-ui"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { data } = betterAuthClient.useSession()

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 p-6">
      <UserButton size={"icon"} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
