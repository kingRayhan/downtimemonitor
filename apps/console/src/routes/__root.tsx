import { AppLoadingScreen } from "@/components/app-loading-screen"
import { jotaiStore } from "@/store"
import {
  appAuthAtom,
  fetchAuthApis,
  type IAuthContext,
} from "@/store/auth.atom"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"

export const Route = createRootRouteWithContext<{ auth: IAuthContext }>()({
  component: RootComponent,
  beforeLoad: async (ctx) => {
    const auth = jotaiStore.get(appAuthAtom)
    if (!auth.isAuthApiCalled) {
      await fetchAuthApis()
    }

    return {
      ...ctx,
      auth,
    }
  },
  pendingComponent: () => <AppLoadingScreen label="Loading session…" />,
})

function RootComponent() {
  return <Outlet />
}
