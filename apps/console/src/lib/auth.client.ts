import { createAuthClient } from "better-auth/react"
import { apiKeyClient } from "@better-auth/api-key/client"
import { organizationClient } from "better-auth/client/plugins"

export const betterAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  basePath: "/auth",
  plugins: [apiKeyClient(), organizationClient()],
})
