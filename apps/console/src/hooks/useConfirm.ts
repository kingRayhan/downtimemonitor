import { useContext } from "react"
import { ConfirmContext } from "../providers/ConfirmProvider"

export type ConfirmTriggerOptions = {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void | Promise<void>
}

export type ConfirmApi = {
  trigger: (options: ConfirmTriggerOptions) => void
}

export function useConfirm(): ConfirmApi {
  const ctx = useContext(ConfirmContext)
  if (!ctx) {
    throw new Error("useConfirm must be used within ConfirmProvider")
  }
  return ctx
}

