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
  useSearch,
} from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
})

export const Route = createLazyFileRoute("/auth/sign-in")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/auth/sign-in" }) as { redirectTo?: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const callbackURL = search.redirectTo || "/"
    const { error } = await betterAuthClient.signIn.email({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe ?? true,
      callbackURL,
    })
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message ?? "Failed to sign in.")
      return
    }
    await navigate({ to: callbackURL })
  }

  return (
    <div className="container mx-auto flex min-h-dvh items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Welcome back. Sign in to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-in-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-in-email"
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
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="sign-in-password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
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
            form="sign-in-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
            <Link to="/auth/forgot-password" search={search}>
              Forgot password?
            </Link>
            <Link to="/auth/sign-up" search={search}>
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
