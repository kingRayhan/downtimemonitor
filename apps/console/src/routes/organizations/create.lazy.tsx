import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { betterAuthClient } from "@/lib/auth.client"
import { jotaiStore } from "@/store"
import { appAuthAtom, fetchAuthApis } from "@/store/auth.atom"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLazyFileRoute, useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(5, "Title must be at least 5 characters."),
})

export const Route = createLazyFileRoute("/organizations/create")({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error, data: newOrganization } =
        await betterAuthClient.organization.create({
          name: values.name.trim(),
          slug: `${values.name.trim().toLowerCase().replace(/ /g, "-")}-${Date.now()}`,
        })

      if (error) {
        throw new Error(error.message ?? "Failed to create organization")
      }

      await fetchAuthApis()
      jotaiStore.set(appAuthAtom, (draft) => {
        draft.activeOrganization = newOrganization
      })
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
      <div className="w-full max-w-md">
        <div className="mb-6 space-y-1 text-left">
          <h1 className="text-xl font-semibold">Create organization</h1>
          <p className="text-sm text-muted-foreground">
            Organizations let you separate workspaces, members, and permissions.
          </p>
        </div>

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
          </FieldGroup>

          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Creating..."
                : "Create organization"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
