import { useUser } from "@clerk/react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@repo/convex"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useWorkspace } from "@/contexts/use-workspace"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/create-workspace")({
  component: CreateWorkspacePage,
})

function slugFromName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "my-workspace"
}

function CreateWorkspacePage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { setCurrent } = useWorkspace()
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const clerkUserId = user?.id ?? ""
  const convexUser = useQuery(
    api.users.queries.findOne,
    clerkUserId
      ? {
          where: {
            key: "clerk_user_id",
            value: clerkUserId,
            operator: "eq",
          },
        }
      : "skip"
  )
  const createWorkspace = useMutation(api.workspaces.mutations.create)
  const createMember = useMutation(api.workspaceMembers.mutations.create)

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slug || slug === slugFromName(name)) setSlug(slugFromName(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!convexUser?._id) {
      setError("Your account is not synced yet. Please try again in a moment.")
      return
    }
    const finalSlug = slug.trim() || slugFromName(name) || "my-workspace"
    if (!finalSlug) {
      setError("Workspace URL is required.")
      return
    }
    setSubmitting(true)
    try {
      const workspaceId = await createWorkspace({
        slug: finalSlug,
        name: name.trim() || "My Workspace",
        created_by_user_id: convexUser._id,
      })
      await createMember({
        workspace_id: workspaceId,
        user_id: convexUser._id,
        role: "owner",
      })
      setCurrent({
        id: workspaceId,
        slug: finalSlug,
        name: name.trim() || "My Workspace",
        role: "owner",
      })
      navigate({ to: "/" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create workspace")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create a workspace</CardTitle>
          <CardDescription>
            Create your first workspace to get started, or add another one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="My Workspace"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                URL slug
              </label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-workspace"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create workspace"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
