export type ToastVariant = "success" | "error" | "warning" | "info"

type ToastEvent = {
  message: string
  variant: ToastVariant
}

type ToastEventListener = (event: ToastEvent) => void

const listeners: Set<ToastEventListener> = new Set()

export const toastEvents = {
  emit: (event: ToastEvent) => listeners.forEach((fn) => fn(event)),
  subscribe: (fn: ToastEventListener) => {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}
