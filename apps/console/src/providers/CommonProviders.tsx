import { ConvexProvider, ConvexReactClient } from "convex/react"
import type { PropsWithChildren } from "react"
import { Provider as JotaiProvider } from "jotai"
import WorkspaceProvider from "./WorkspaceProvider"
import { ThemeProvider } from "@/components/theme-provider"
import ConfirmProvider from "./ConfirmProvider"
import { jotaiStore } from "@/store"

const CommonProviders: React.FC<PropsWithChildren> = ({ children }) => {
  const convex = new ConvexReactClient(
    import.meta.env.VITE_CONVEX_URL as string
  )

  return (
    <ThemeProvider>
      <JotaiProvider store={jotaiStore}>
        <ConfirmProvider>
          <ConvexProvider client={convex}>
            <WorkspaceProvider>{children}</WorkspaceProvider>
          </ConvexProvider>
        </ConfirmProvider>
      </JotaiProvider>
    </ThemeProvider>
  )
}

export default CommonProviders
