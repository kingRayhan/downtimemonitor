"use client"

import { Link, useNavigate } from "@tanstack/react-router"
import { useWorkspace } from "@/contexts/use-workspace"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon, PlusIcon } from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "@repo/convex"
import { useUser } from "@clerk/react"

export function WorkspaceSwitcher() {
  const { user } = useUser()
  const clerkUserId = user?.id ?? ""
  useQuery(api.workspaces.queries.listForClerkUser, {
    clerk_user_id: clerkUserId,
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm">
            <span className="max-w-[140px] truncate">
              {current?.name ?? "Select workspace"}
            </span>
            <ChevronDownIcon className="size-4 opacity-50" />
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {workspaces.map((w) => (
          <DropdownMenuItem key={w.id} onSelect={() => setCurrent(w)}>
            {w.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          onSelect={() => navigate({ to: "/create-workspace" })}
        >
          <PlusIcon className="size-4" />
          Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
