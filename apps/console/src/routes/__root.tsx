import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AppShell } from "../components/app-shell";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <AppShell>
      <Outlet />
      <TanStackRouterDevtools />
    </AppShell>
  ),
});
