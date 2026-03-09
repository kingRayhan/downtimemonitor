import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { ThemeProvider } from "@/components/theme-provider"
import { RouterProvider } from "@tanstack/react-router"
import { getRouter } from "./routes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={getRouter()} />
    </ThemeProvider>
  </StrictMode>
)
