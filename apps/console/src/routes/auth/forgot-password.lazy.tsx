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
  useSearch,
} from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
})

export const Route = createLazyFileRoute("/auth/forgot-password")({
  component: RouteComponent,
})

function RouteComponent() {
  const search = useSearch({ from: "/auth/forgot-password" }) as {
    redirectTo?: string
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const redirectTo = `${window.location.origin}/auth/reset-password`
    const { error } = await betterAuthClient.requestPasswordReset({
      email: values.email,
      redirectTo,
    })
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message ?? "Failed to request password reset.")
      return
    }
    // eslint-disable-next-line no-alert
    alert("If an account exists for that email, a reset link has been sent.")
    form.reset()
  }

  return (
    <div className="container mx-auto flex min-h-dvh items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="forgot-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="forgot-password-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="forgot-password-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
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
            form="forgot-password-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
          <div className="text-sm text-muted-foreground">
            <Link to="/auth/sign-in" search={search}>
              Back to sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
