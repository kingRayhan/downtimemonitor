"use client"

import { useWorkspace } from "@/providers/WorkspaceProvider"

export function WorkspaceSwitcher() {
  const { workspaces } = useWorkspace()

  if (workspaces.length === 0) return null
  return <div className="text-sm text-muted-foreground">{workspaces[0]?.name}</div>

  // return (
  //   <DropdownMenu>
  //     <DropdownMenuTrigger
  //       render={
  //         <Button variant="outline" size="sm">
  //           <span className="max-w-[140px] truncate">
  //             {current?.name ?? "Select workspace"}
  //           </span>
  //           <ChevronDownIcon className="size-4 opacity-50" />
  //         </Button>
  //       }
  //     />
  //     <DropdownMenuContent align="start" className="min-w-[180px]">
  //       {workspaces.map((w) => (
  //         <DropdownMenuItem key={w.id} onSelect={() => setCurrent(w)}>
  //           {w.name}
  //         </DropdownMenuItem>
  //       ))}
  //       <DropdownMenuItem
  //         onSelect={() => navigate({ to: "/create-workspace" })}
  //       >
  //         <PlusIcon className="size-4" />
  //         Create workspace
  //       </DropdownMenuItem>
  //     </DropdownMenuContent>
  //   </DropdownMenu>
  // )
}
