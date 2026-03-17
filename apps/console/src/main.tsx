import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ConvexProvider, ConvexReactClient } from "convex/react"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { getRouter } from "./routes"
import WorkspaceProvider from "./providers/WorkspaceProvider"

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ConvexProvider client={convex}>
        <WorkspaceProvider>
          <RouterProvider router={getRouter()} />
        </WorkspaceProvider>
      </ConvexProvider>
    </ThemeProvider>
  </StrictMode>
)
