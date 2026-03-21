"use client"

import { createContext, useState, useCallback, useEffect } from "react"
import { toastEvents, type ToastVariant } from "@/lib/events/toastEvents"

const MAX_TOASTS = 3
const DEFAULT_DURATION = 5000

export type Toast = {
  id: string
  message: string
  variant: ToastVariant
  isExiting: boolean
}

type ToastContextValue = {
  toasts: Toast[]
  addToast: (message: string, variant: ToastVariant, duration?: number) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toast.id === id ? { ...toast, isExiting: true } : toast))
    )

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 300)
  }, [])

  const addToast = useCallback(
    (message: string, variant: ToastVariant, duration = DEFAULT_DURATION) => {
      const id = crypto.randomUUID()
      const newToast: Toast = { id, message, variant, isExiting: false }

      setToasts((prev) => {
        const updated = [...prev, newToast]
        if (updated.length > MAX_TOASTS) {
          return updated.slice(-MAX_TOASTS)
        }
        return updated
      })

      setTimeout(() => {
        removeToast(id)
      }, duration)
    },
    [removeToast]
  )

  useEffect(() => {
    const unsubscribe = toastEvents.subscribe((event) => {
      addToast(event.message, event.variant)
    })
    return () => {
      unsubscribe()
    }
  }, [addToast])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}
