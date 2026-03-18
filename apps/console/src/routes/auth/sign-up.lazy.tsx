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
  useNavigate,
  useSearch,
} from "@tanstack/react-router"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(64),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128),
})

export const Route = createLazyFileRoute("/auth/sign-up")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const search = useSearch({ from: "/auth/sign-up" }) as { redirectTo?: string }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any) as any,
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const callbackURL = search.redirectTo || "/_dashboard"
    const { error } = await betterAuthClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL,
    })
    if (error) {
      // eslint-disable-next-line no-alert
      alert(error.message ?? "Failed to sign up.")
      return
    }
    await navigate({ to: callbackURL })
  }

  return (
    <div className="container mx-auto flex min-h-dvh items-center justify-center p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Sign up with email and password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="sign-up-form"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-name">Name</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-name"
                      autoComplete="name"
                      placeholder="Jane Doe"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-email"
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
                    <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
                    <Input
                      {...field}
                      id="sign-up-password"
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
            form="sign-up-form"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create account"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/sign-in" search={search}>
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
