"use client"

import { Loader2 } from "lucide-react"

export function AppLoadingScreen({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  )
}

