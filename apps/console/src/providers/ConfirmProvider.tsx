"use client"

import { createContext, useCallback, useMemo, useState } from "react"
import type { PropsWithChildren } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ConfirmApi, ConfirmTriggerOptions } from "@/hooks/useConfirm"

type ConfirmState = {
  open: boolean
  loading: boolean
  options: ConfirmTriggerOptions | null
}

export const ConfirmContext = createContext<ConfirmApi | null>(null)

export default function ConfirmProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    loading: false,
    options: null,
  })

  const trigger = useCallback((options: ConfirmTriggerOptions) => {
    setState({ open: true, loading: false, options })
  }, [])

  const api = useMemo<ConfirmApi>(() => ({ trigger }), [trigger])

  const close = () => {
    setState((s) => ({ ...s, open: false, loading: false, options: null }))
  }

  const onCancel = async () => {
    const opts = state.options
    close()
    try {
      await opts?.onCancel?.()
    } catch (e) {
      console.error(e)
    }
  }

  const onConfirm = async () => {
    const opts = state.options
    if (!opts) return
    setState((s) => ({ ...s, loading: true }))
    try {
      await opts.onConfirm?.()
      close()
    } catch (e) {
      console.error(e)
      // Keep dialog open so user can retry/cancel
      setState((s) => ({ ...s, loading: false }))
    }
  }

  return (
    <ConfirmContext.Provider value={api}>
      {children}
      <AlertDialog
        open={state.open}
        onOpenChange={(open) => {
          if (!open && state.open && !state.loading) {
            void onCancel()
          }
        }}
      >
        {state.options ? (
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{state.options.title}</AlertDialogTitle>
              {state.options.description ? (
                <AlertDialogDescription>
                  {state.options.description}
                </AlertDialogDescription>
              ) : null}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={state.loading}>
                {state.options.cancelText ?? "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={state.loading}
                onClick={(e) => {
                  e.preventDefault()
                  void onConfirm()
                }}
              >
                {state.loading
                  ? "Working..."
                  : (state.options.confirmText ?? "Confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}
