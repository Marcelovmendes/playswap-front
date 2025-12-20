import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type ButtonVariant = "primary" | "secondary" | "gradient"
type ButtonSize = "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const variantClasses = {
  primary:
    "bg-gradient-primary text-white shadow-green-glow hover:shadow-green-glow-lg hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "glass-effect text-text-primary hover:bg-white/10 hover:border-white/20 active:bg-white/[0.08]",
  gradient:
    "bg-gradient-secondary text-white shadow-blue-glow hover:shadow-blue-glow-lg hover:-translate-y-0.5 active:translate-y-0",
}

const sizeClasses = {
  sm: "px-base py-sm text-sm",
  md: "px-lg py-md text-base",
  lg: "px-xl py-base text-lg",
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-sm font-semibold tracking-wide rounded-lg transition-all duration-base cursor-pointer border-none outline-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-accent-green focus-visible:outline-offset-2",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
