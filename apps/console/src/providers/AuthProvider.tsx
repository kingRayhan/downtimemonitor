import { useUser } from "@clerk/react"
import { api } from "@repo/convex"
import { useQuery } from "convex/react"
import type { Doc } from "node_modules/@repo/convex/convex/_generated/dataModel"
import React from "react"

type AuthUser = Doc<"users">

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
})

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user: clerkUser } = useUser()
  const user = useQuery(api.users.queries.findOne, {
    where: {
      key: "auth_provider_id",
      value: clerkUser?.id ?? "",
      operator: "eq",
    },
  })
  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        loading: !user && !clerkUser ? true : false,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
