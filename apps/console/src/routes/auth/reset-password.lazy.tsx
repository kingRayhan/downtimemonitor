"use client"

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
import {
  createLazyFileRoute,
  Link,
  redirect,
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128),
})

export const Route = createLazyFileRoute("/auth/reset-password")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/auth/reset-password" }) as {
    token?: string
    error?: string
    redirectTo?: string
  }

  const token =
    search.token ??
    new URLSearchParams(window.location.search).get("token") ??
    ""

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: { newPassword: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      // eslint-disable-next-line no-alert
      alert("Missing reset token.")
      return
    }
    const { error } = await betterAuthClient.resetPassword({
      newPassword: values.newPassword,
      token,
    })
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message ?? "Failed to reset password.")
      return
    }
    // eslint-disable-next-line no-alert
    alert("Password reset successful. You can now sign in.")
  }

  return (
    <div className="container mx-auto flex min-h-dvh items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Set a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token && (
            <p className="mb-4 text-sm text-destructive">
              Missing reset token. Please use the link from your email.
            </p>
          )}
          {search.error && (
            <p className="mb-4 text-sm text-destructive">{search.error}</p>
          )}
          <form
            id="reset-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="newPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="reset-password-new">
                      New password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="reset-password-new"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      aria-invalid={fieldState.invalid}
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
        <CardFooter className="flex flex-col gap-3">
          <Button
            type="submit"
            form="reset-password-form"
            className="w-full"
            disabled={form.formState.isSubmitting || !token}
          >
            {form.formState.isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
          <div className="text-sm text-muted-foreground">
            <Link to="/auth/sign-in">Back to sign in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
