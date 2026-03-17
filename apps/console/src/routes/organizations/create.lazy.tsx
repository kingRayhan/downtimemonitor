import { betterAuthClient } from "@/lib/auth.client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createLazyFileRoute, redirect } from "@tanstack/react-router"
import { useState } from "react"

export const Route = createLazyFileRoute("/organizations/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    const finalSlug =
      slug.trim() ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

    setIsSubmitting(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orgClient: any = (betterAuthClient as any).organization
      if (!orgClient?.create) {
        throw new Error("Organization client is not available")
      }
      const { error: createError } = await orgClient.create({
        name: name.trim(),
        slug: finalSlug,
      })
      if (createError) {
        throw new Error(createError.message ?? "Failed to create organization")
      }
      // Optionally redirect to dashboard after creation
      window.location.href = "/"
    } catch (err) {
      console.error(err)
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center gap-6 p-4 md:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Create organization</h1>
          <p className="text-sm text-muted-foreground">
            Organizations let you separate workspaces, members, and permissions.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="acme-inc"
            />
            <p className="text-xs text-muted-foreground">
              Used in URLs and APIs. Leave blank to generate from the name.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create organization"}
          </Button>
        </form>
      </div>
    </main>
  )
}
