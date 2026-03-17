import { createAuthClient } from "better-auth/react"

export const betterAuthClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  basePath: "/auth",
})
