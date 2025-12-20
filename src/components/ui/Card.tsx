import { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type CardPadding = "sm" | "md" | "lg"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
  padding?: CardPadding
}

const paddingClasses = {
  sm: "p-md",
  md: "p-lg",
  lg: "p-xl",
}

export function Card({
  children,
  hover = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative bg-white/[0.02] border border-border rounded-xl backdrop-blur-[10px] transition-all duration-base",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent-green/10 before:to-accent-blue/10 before:opacity-0 before:transition-opacity before:duration-base before:rounded-xl before:pointer-events-none",
        hover &&
          "cursor-pointer hover:-translate-y-1 hover:border-accent-green/40 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)] hover:before:opacity-100",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
