import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { PropsWithChildren } from "react"
import WorkspaceProvider from "./WorkspaceProvider"
import { ThemeProvider } from "@/components/theme-provider"
import ConfirmProvider from "./ConfirmProvider"

const CommonProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const convex = new ConvexReactClient(
    import.meta.env.VITE_CONVEX_URL as string
  )

  return (
    <ThemeProvider>
      <ConfirmProvider>
        <ConvexProvider client={convex}>
          <WorkspaceProvider>{children}</WorkspaceProvider>
        </ConvexProvider>
      </ConfirmProvider>
    </ThemeProvider>
  )
}

export default CommonProviders
