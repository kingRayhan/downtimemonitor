import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { useConfirm } from "@/hooks/useConfirm"
import { betterAuthClient } from "@/lib/auth.client"
import { useAuth } from "@/store/auth.atom"

const UserButton = () => {
  const auth = useAuth()
  const confirm = useConfirm()

  const handleLogout = async () => {
    confirm.trigger({
      title: "Log out",
      description: "Are you sure you want to log out?",
      confirmText: "Log out",
      cancelText: "Cancel",
      onConfirm: async () => {
        await betterAuthClient.signOut()
        window.location.href = "/"
      },
    })
  }
  return (
    <>
      {/* <pre>{JSON.stringify(auth.user, null, 2)}</pre> */}
      <DropdownMenu>
        <DropdownMenuTrigger>{auth?.user?.name}</DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleLogout}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default UserButton
