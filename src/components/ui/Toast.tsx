"use client"

import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ToastVariant } from "@/lib/events/toastEvents"

type ToastProps = {
  id: string
  message: string
  variant: ToastVariant
  isExiting: boolean
  onClose: (id: string) => void
}

const variantConfig = {
  success: {
    icon: CheckCircle,
    borderColor: "border-l-semantic-success",
    iconColor: "text-semantic-success",
  },
  error: {
    icon: XCircle,
    borderColor: "border-l-semantic-error",
    iconColor: "text-semantic-error",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-semantic-warning",
    iconColor: "text-semantic-warning",
  },
  info: {
    icon: Info,
    borderColor: "border-l-semantic-info",
    iconColor: "text-semantic-info",
  },
}

export function Toast({ id, message, variant, isExiting, onClose }: ToastProps) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "glass-effect rounded-lg p-md max-w-sm border-l-4 flex items-start gap-base",
        config.borderColor,
        isExiting ? "animate-slide-out-right" : "animate-slide-in-right"
      )}
      role="alert"
    >
      <Icon className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconColor)} />
      <p className="text-sm text-text-primary flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-text-muted hover:text-text-primary transition-colors flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
