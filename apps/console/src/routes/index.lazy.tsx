import { useWorkspace } from "@/providers/WorkspaceProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Link, createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { workspaces, loading } = useWorkspace()

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading workspaces…</div>
      </div>
    )
  }

  const hasWorkspaces = workspaces.length > 0

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-6 p-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Choose a workspace
        </h1>
        <p className="text-sm text-muted-foreground">
          Select a workspace to open the console, or create a new one.
        </p>
      </header>

      {hasWorkspaces ? (
        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((workspace) => (
            <Card
              key={workspace._id}
              className="group flex flex-col justify-between border-border/70 transition hover:border-primary/60 hover:shadow-sm"
            >
              <CardHeader className="space-y-2 pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span className="truncate">{workspace.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {workspace.role}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between pt-0">
                <Button
                  size="sm"
                  className="w-full justify-center"
                  render={
                    <Link
                      to="/$workspaceId"
                      params={{ workspaceId: workspace._id }}
                    />
                  }
                >
                  Open workspace
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              No workspaces yet
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Create your first workspace to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
