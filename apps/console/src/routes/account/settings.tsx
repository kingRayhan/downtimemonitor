import { Button } from "@/components/ui/button"
import { AccountSettingsCards } from "@daveyplate/better-auth-ui"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/account/settings")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col justify-center gap-2 px-4 py-12">
      <div>
        <Button variant="ghost">
          <Link to={"/"}>
            <ArrowLeftIcon />
            Back
          </Link>
        </Button>
      </div>
      <AccountSettingsCards className="max-w-xl" />
    </div>
  )
}
