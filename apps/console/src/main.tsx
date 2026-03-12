import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ClerkProvider, Show, SignIn } from "@clerk/react"
import { ConvexProvider, ConvexReactClient } from "convex/react"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { getRouter } from "./routes"
import AuthProvider from "./providers/AuthProvider"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <Show when="signed-in">
          <ConvexProvider client={convex}>
            <AuthProvider>
              <RouterProvider router={getRouter()} />
            </AuthProvider>
          </ConvexProvider>
        </Show>
        <Show when="signed-out">
          <div className="flex h-screen items-center justify-center">
            <SignIn />
          </div>
        </Show>
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
)
