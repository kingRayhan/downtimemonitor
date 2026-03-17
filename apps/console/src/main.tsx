import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { betterAuthClient } from "./lib/auth.client"
import WorkspaceProvider from "./providers/WorkspaceProvider"
import { getRouter } from "./routes"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConvexProvider client={convex}>
        <AuthUIProvider authClient={betterAuthClient}>
          <WorkspaceProvider>
            <RouterProvider router={getRouter()} />
          </WorkspaceProvider>
        </AuthUIProvider>
      </ConvexProvider>
    </ThemeProvider>
  </StrictMode>
)
