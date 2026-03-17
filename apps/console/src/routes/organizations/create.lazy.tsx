import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { betterAuthClient } from "@/lib/auth.client"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLazyFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(5, "Title must be at least 5 characters."),
  slug: z.string().max(64, "Slug must be at most 64 characters.").optional(),
})

export const Route = createLazyFileRoute("/organizations/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await betterAuthClient.organization.create({
        name: values.name.trim(),
        slug: values.slug?.trim() || "",
      })

      if (error) {
        throw new Error(error.message ?? "Failed to create organization")
      }

      await router.navigate({ to: "/" })
    } catch (err) {
      console.error(err)
      setServerError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    }
  }

  return (
    <main className="container mx-auto flex grow flex-col items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create organization</CardTitle>
          <CardDescription>
            Organizations let you separate workspaces, members, and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {serverError && (
            <div className="mb-4 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form
            id="org-create-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="org-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Acme Inc."
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="slug"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="org-slug">Slug</FieldLabel>
                    <Input
                      {...field}
                      id="org-slug"
                      aria-invalid={fieldState.invalid}
                      placeholder="acme-inc"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button
            type="submit"
            form="org-create-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Creating..."
              : "Create organization"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
