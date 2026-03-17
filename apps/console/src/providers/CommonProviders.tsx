import { betterAuthClient } from "@/lib/auth.client"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import { useRouter } from "@tanstack/react-router"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { PropsWithChildren } from "react"
import WorkspaceProvider from "./WorkspaceProvider"
import { ThemeProvider } from "@/components/theme-provider"

const CommonProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const convex = new ConvexReactClient(
    import.meta.env.VITE_CONVEX_URL as string
  )
  const router = useRouter()

  return (
    <ThemeProvider>
      <AuthUIProvider
        authClient={betterAuthClient}
        navigate={(href) => router.navigate({ href })}
      >
        <ConvexProvider client={convex}>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </ConvexProvider>
      </AuthUIProvider>
    </ThemeProvider>
  )
}

export default CommonProviders
