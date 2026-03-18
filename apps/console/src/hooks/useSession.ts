import { useRouteContext } from "@tanstack/react-router"
import type { Session, User } from "better-auth/types"

export const useSession = () => {
  const context = useRouteContext({ from: "__root__" })
  return context.session.data as {
    session: Session
    user: User
  } | null
}
