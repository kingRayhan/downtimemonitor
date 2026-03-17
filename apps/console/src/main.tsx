import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"

import { RouterProvider } from "@tanstack/react-router"
import CommonProviders from "./providers/CommonProviders"
import { getRouter } from "./routes"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CommonProviders>
      <RouterProvider router={getRouter()} />
    </CommonProviders>
  </StrictMode>
)
