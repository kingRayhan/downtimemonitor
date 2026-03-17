"use client"

import { ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { useMemo } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { betterAuthClient } from "@/lib/auth.client"
import { useNavigate } from "@tanstack/react-router"

export function OrgSwitcher() {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()
  const { data: organizations, isRefetching: isRefetchingOrganizations } =
    betterAuthClient.useListOrganizations()
  const {
    data: activeOrganization,
    isRefetching: isRefetchingActiveOrganization,
  } = betterAuthClient.useActiveOrganization()

  const isLoading = useMemo(
    () => isRefetchingOrganizations || isRefetchingActiveOrganization,
    [isRefetchingOrganizations, isRefetchingActiveOrganization]
  )

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="gap-2">
            <Loader2 className="size-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading organizations...
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <span className="text-sm font-semibold">
                  {activeOrganization?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {activeOrganization?.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Organizations
              </DropdownMenuLabel>
              {organizations?.map((org) => {
                const isActive = org.id === activeOrganization?.id
                return (
                  <DropdownMenuItem
                    key={org.id}
                    className="gap-2 p-2"
                    onClick={() =>
                      betterAuthClient.organization.setActive({
                        organizationId: org.id,
                      })
                    }
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <span className="text-xs font-semibold">
                        {org.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="flex-1 truncate">{org.name}</span>
                    {isActive && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => navigate({ to: "/organizations/create" })}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add organization
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
