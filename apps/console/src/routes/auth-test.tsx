import { useAppSession } from "@/providers/AuthProvider"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth-test")({
  component: RouteComponent,
})

function RouteComponent() {
  const { loading, user } = useAppSession()
  return <pre>{JSON.stringify({ loading, user }, null, 2)}</pre>
}
