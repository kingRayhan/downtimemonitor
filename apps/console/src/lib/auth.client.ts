import { createAuthClient } from "better-auth/react"
import { apiKeyClient } from "@better-auth/api-key/client"

export const betterAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  basePath: "/auth",
  // plugins: [apiKeyClient()],
})
