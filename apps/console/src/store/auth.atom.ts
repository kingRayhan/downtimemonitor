import { betterAuthClient } from "@/lib/auth.client"
import type { Organization } from "better-auth/plugins"
import type { Session, User } from "better-auth/types"
import { useAtomValue } from "jotai"
import { atomWithImmer } from "jotai-immer"
import { jotaiStore } from "."

export interface IAuthContext {
  session: Session | null
  user: User | null
  organizations: Organization[]
  activeOrganization: Organization | null
  isAuthApiCalled: boolean
}
export const appAuthAtom = atomWithImmer<IAuthContext>({
  session: null as Session | null,
  user: null,
  organizations: [],
  activeOrganization: null,
  isAuthApiCalled: false,
})

export async function fetchAuthApis() {
  try {
    const session = await betterAuthClient.getSession()
    const organizations = await betterAuthClient.organization.list()
    const activeOrganization =
      await betterAuthClient.organization.getFullOrganization()

    jotaiStore.set(appAuthAtom, (draft) => {
      draft.session = session.data as Session | null
      draft.user = session.data?.user || null
      draft.organizations = organizations.data || []
      draft.activeOrganization = activeOrganization.data || null
      draft.isAuthApiCalled = true
    })

    return {
      session: session.data?.session,
      user: session.data?.user,
      organizations: organizations.data,
      activeOrganization: activeOrganization.data,
      isAuthApiCalled: true,
    }
  } catch {
    jotaiStore.set(appAuthAtom, (draft) => {
      draft.session = null
      draft.user = null
      draft.organizations = []
      draft.activeOrganization = null
      draft.isAuthApiCalled = false
    })

    return {
      session: null,
      user: null,
      organizations: [],
      activeOrganization: null,
      isAuthApiCalled: false,
    }
  }
}

export function useAuth() {
  return useAtomValue(appAuthAtom)
}
