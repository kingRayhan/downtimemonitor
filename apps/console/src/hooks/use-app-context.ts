import { useRouteContext } from "@tanstack/react-router"
import type { Organization } from "better-auth/plugins"
import type { Session, User } from "better-auth/types"

export const useAppContext = () => {
  const context = useRouteContext({ from: "__root__" })
  return {
    session: context.session.data,
    user: context.session.data.user,
    organizations: context.organizations.data,
    activeOrganization: context.activeOrganization.data,
  } as {
    session: Session
    user: User
    organizations: Organization[] | null
    activeOrganization: Organization | null
  }
}
