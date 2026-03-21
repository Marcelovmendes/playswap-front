"use client"

import { useToast } from "@/lib/hooks/useToast"
import { Toast } from "./Toast"

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  if (toasts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-md right-md z-50 flex flex-col gap-sm">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          isExiting={toast.isExiting}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}
